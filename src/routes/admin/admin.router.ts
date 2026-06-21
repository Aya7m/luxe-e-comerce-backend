import { Router } from "express";
import { adminOnly, protect } from "../../middleware/auth.middleware.js";
import { adminDashboard, getAllUsers, updateUserRole } from "../../controller/admin/admin.controller.js";

const adminRouter=Router()
adminRouter.get(
  "/users",
  protect,
  adminOnly,
  getAllUsers
);

adminRouter.patch(
  "/users/:userId",
  protect,
  adminOnly,
  updateUserRole
);

adminRouter.get(
  "/stats",
  protect,
  adminOnly,
  adminDashboard
);

export default adminRouter