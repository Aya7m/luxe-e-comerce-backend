import { Router } from "express";
import { adminOnly, protect } from "../../middleware/auth.middleware.js";
import {
  confirmStripePayment,
  createCheckoutSession,
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrderState,
} from "../../controller/orders/order.controller.js";

const orderRouter = Router();

orderRouter.post("/", protect, createOrder);
orderRouter.post("/checkout-session", protect, createCheckoutSession);
orderRouter.get("/my-order", protect, getMyOrders);
orderRouter.get("/", protect, getAllOrders);
orderRouter.patch("/:id/status", protect, adminOnly, updateOrderState);
orderRouter.post(
  "/confirm-payment",
  protect,
  confirmStripePayment
);
export default orderRouter;
