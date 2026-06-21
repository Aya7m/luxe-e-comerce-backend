import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Product } from "./modules/products/product.model.js";
import { products } from "../data/products.js";


const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    await Product.deleteMany();
    await Product.insertMany(products);

    console.log("Products inserted successfully");
    process.exit();
  } catch (error) {
    console.log("Seed error:", error);
    process.exit(1);
  }
};

seedProducts();