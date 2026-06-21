import type { Request, Response } from "express";
import { User } from "../../modules/auth/user.model.ts";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { AuthRequest } from "../../middleware/auth.middleware.js";

const createToken = (userId: string, role: string): String => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res
        .status(400)
        .json({ message: "Please provide name, email and password" });
      return;
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = createToken(user._id, user.role);
    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Please provide email and password" });
      return;
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }
    const token = createToken(user._id, user.role);
    res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get user",
    });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch {
    res.status(500).json({ message: "Failed to get users" });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role: req.body.role },
      { new: true },
    ).select("-password");

    res.json(user);
  } catch {
    res.status(500).json({ message: "Failed to update role" });
  }
};
