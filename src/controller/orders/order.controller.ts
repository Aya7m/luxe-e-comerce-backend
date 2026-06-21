import type { Request, Response } from "express";
import { Order } from "../../modules/orders/order.model.js";
import type { AuthRequest } from "../../middleware/auth.middleware.js";
import { Cart } from "../../modules/cart/cart.model.js";
import stripe from "../../config/stripe.js";

export const createOrder = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user: req.user?.userId }).populate(
      "items.product",
    );

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
      0,
    );

    const order = await Order.create({
      user: req.user?.userId,
      items,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      totalPrice,
    });

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch {
    res.status(500).json({ message: "Failed to create order" });
  }
};

export const getMyOrders = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const myOrders = await Order.find({ user: req.user?.userId }).sort({
      createdAt: -1,
    });
    res.json(myOrders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get orders" });
  }
};

export const getAllOrders = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to get all orders" });
  }
};

export const updateOrderState = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true },
    );
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order" });
  }
};



export const createCheckoutSession = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const cart = await Cart.findOne({
      user: req.user?.userId,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: "Cart is empty" });
      return;
    }

    const lineItems = cart.items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
        },
        unit_amount: item.product.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,


  metadata: {
    userId: req.user?.userId,
    fullName: req.body.fullName,
    phone: req.body.phone,
    address: req.body.address,
    city: req.body.city,
  },
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: `${process.env.CLIENT_URL}/checkout`,
    });

    res.json({
      url: session.url,
    });
  } catch (error) {
    res.status(500).json({
      message: "Stripe error",
    });
  }
};


export const confirmStripePayment = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res.status(400).json({ message: "Invalid session" });
    }

    const cart = await Cart.findOne({
      user: session.metadata?.userId,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
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
      user: session.metadata?.userId,
      items,
      shippingAddress: {
        fullName: session.metadata?.fullName,
        phone: session.metadata?.phone,
        address: session.metadata?.address,
        city: session.metadata?.city,
      },
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