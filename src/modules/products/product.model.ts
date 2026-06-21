import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    stock: { type: Number, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);