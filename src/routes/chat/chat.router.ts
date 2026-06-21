import { Router } from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { getMessages, sendMessage } from "../../controller/chat/chat.controller.js";

const chatRouter=Router()
chatRouter.get("/:userId", protect, getMessages);

chatRouter.post("/", protect, sendMessage);

export default chatRouter