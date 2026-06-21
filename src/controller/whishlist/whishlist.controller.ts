import mongoose from "mongoose";
import type { Response } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware.js";
import { Wishlist } from "../../modules/wishlist/wishlist.model.js";
import { Product } from "../../modules/products/product.model.js";


export const getWishlist = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user?.userId,
    }).populate("products");

    res.json(wishlist || { products: [] });
  } catch (error) {
    console.log("GET WISHLIST ERROR:", error);
    res.status(500).json({ message: "Failed to get wishlist" });
  }
};


export const toggleWishlist = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      res.status(400).json({ message: "Invalid product id" });
      return;
    }

    const productExists = await Product.findById(productId);

    if (!productExists) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    let wishlist = await Wishlist.findOne({
      user: req.user?.userId,
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user?.userId,
        products: [productId],
      });

      const populatedWishlist = await wishlist.populate("products");
      res.status(201).json(populatedWishlist);
      return;
    }

    const exists = wishlist.products.some(
      (product) => product.toString() === productId
    );

    if (exists) {
      wishlist.products = wishlist.products.filter(
        (product) => product.toString() !== productId
      );
    } else {
      wishlist.products.push(new mongoose.Types.ObjectId(productId));
    }

    await wishlist.save();

    const populatedWishlist = await wishlist.populate("products");

    res.json(populatedWishlist);
  } catch (error) {
    console.log("TOGGLE WISHLIST ERROR:", error);
    res.status(500).json({ message: "Failed to update wishlist" });
  }
};