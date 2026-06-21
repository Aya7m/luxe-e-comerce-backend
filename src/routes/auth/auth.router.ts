import { Router } from "express";
import { getAllUsers, getMe, login, register, updateUserRole } from "../../controller/auth/auth.controller.js";
import { adminOnly, protect } from "../../middleware/auth.middleware.js";

const authRouter=Router();
authRouter.post("/register",register);
authRouter.post("/login",login);
authRouter.get("/me", protect, getMe);
authRouter.get("/admin/users", protect, adminOnly, getAllUsers);
authRouter.patch("/admin/users/:userId", protect, adminOnly, updateUserRole);

export default authRouter;