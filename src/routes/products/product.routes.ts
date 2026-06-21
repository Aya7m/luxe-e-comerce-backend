import { Router } from "express";
import {
  createProduct,
  deleteProducts,
  getProductById,
  getProducts,
  updateProducts,
} from "../../controller/products/product.controller.js";
import { adminOnly, protect } from "../../middleware/auth.middleware.js";
const productRouter = Router();

productRouter.get("/", getProducts);
productRouter.get("/:id", getProductById);

productRouter.post("/", protect, adminOnly, createProduct);

productRouter.patch("/:id", protect, adminOnly, updateProducts);
productRouter.delete("/:id", protect, adminOnly, deleteProducts);

export default productRouter;
