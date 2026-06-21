import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { Cart } from "../modules/cart/cart.model.js";
import { Order } from "../modules/orders/order.model.js";

export const confirmStripePayment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const cart = await Cart.findOne({
      user: req.user?.userId,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: "Cart is empty" });
      return;
    }

    const items = cart.items.map((item: any) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.image,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const totalPrice = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user?.userId,
      items,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: "card",
      totalPrice,
      status: "confirmed",
    });

    cart.items = [];
    await cart.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to confirm payment" });
  }
};