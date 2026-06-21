import type { Response } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware.js";
import { User } from "../../modules/auth/user.model.js";
import { Product } from "../../modules/products/product.model.js";
import { ChatMessage } from "../../modules/chat/chat.modules.js";
import { Order } from "../../modules/orders/order.model.js";

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
   const users = await User.find({
      _id: { $ne: req.user?.userId },
    }).select("-password");


    res.json(users);
  } catch {
    res.status(500).json({
      message: "Failed to get users",
    });
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
  } catch (error) {
    res.status(500).json({
      message: "Failed to update role",
    });
  }
};

export const adminDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const productCounts = await Product.countDocuments();
    const userCount = await User.countDocuments();
    const messageCount = await ChatMessage.countDocuments();
    const orders = await Order.find();
    const ordersCount = await Order.countDocuments();

    const totalSale = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.status(200).json({
      productCounts,
      ordersCount,
      userCount,
      messageCount,
      totalSale,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get admin dashboard",
    });
  }
};
