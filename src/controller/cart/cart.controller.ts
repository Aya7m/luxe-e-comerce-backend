import type { Response } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware.js";
import { Cart } from "../../modules/cart/cart.model.js";

export const getCart = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user: req.user?.userId }).populate(
      "items.product",
    );
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: "Failed to get cart", error });
  }
};

export const addToCart = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { productId, quantity = 1 } = req.body;

    let cart = await Cart.findOne({ user: req.user?.userId });

    if (!cart) {
      cart = await Cart.create({
        user: req.user?.userId,
        items: [{ product: productId, quantity }],
      });

      res.status(201).json(cart);
      return;
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    const populatedCart = await cart.populate("items.product");

    res.json(populatedCart);
  } catch {
    res.status(500).json({ message: "Failed to add to cart" });
  }
};

export const removeFromCart = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user: req.user?.userId });

    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId,
    );
    await cart.save();
    const populatedCart = await cart.populate("items.product");

    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: "Failed to remove from cart", error });
  }
};

export const clearCart = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user?.userId },
      { items: [] },
      { new: true },
    );

    res.json(cart || { items: [] });
  } catch {
    res.status(500).json({ message: "Failed to clear cart" });
  }
};

export const updateCartItemQuantity = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user?.userId });
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
      return;
    }

    const item = cart.items.find(
      (item) => item.product.toString() === req.params.productId,
    );

    if (!item) {
      res.status(404).json({ message: "Product not found in cart" });
      return;
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        (item) => item.product.toString() !== req.params.productId,
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();

    const populatedCart = await cart.populate("items.product");

    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: "Failed to update quantity" });
  }
};
