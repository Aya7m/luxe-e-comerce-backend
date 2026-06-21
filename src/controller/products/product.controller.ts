import type { Request, Response } from "express";
import { Product } from "../../modules/products/product.model.js";

export const getProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { search, category, minPrice, maxPrice, rating, sort } = req.query;

    const query: any = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 4;

    const skip = (page - 1) * limit;

    let sortOption: any = { createdAt: -1 };

    if (sort === "low-high") sortOption = { price: 1 };
    if (sort === "high-low") sortOption = { price: -1 };
    if (sort === "rating") sortOption = { rating: -1 };
    if (sort === "newest") sortOption = { createdAt: -1 };

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);
    const totalProducts = await Product.countDocuments(query);

    res.json({
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    });
  } catch {
    res.status(500).json({ message: "Failed to get products" });
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const products = await Product.create(req.body);
    res.status(201).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const updateProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const deleteProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
