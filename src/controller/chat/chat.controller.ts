import type { Response } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware.js";
import { ChatMessage } from "../../modules/chat/chat.modules.js";

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const otherUserId = req.params.userId;

    const messages = await ChatMessage.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to get messages",
    });
  }
};
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const message = await ChatMessage.create({
      sender: req.user!.userId,
      receiver: req.body.receiverId,
      text: req.body.text,
    });

    res.status(201).json(message);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to send message",
    });
  }
};
