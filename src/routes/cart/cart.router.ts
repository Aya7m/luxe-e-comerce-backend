import { Router } from "express";
import { protect } from "../../middleware/auth.middleware.js";
import { addToCart, clearCart, getCart, removeFromCart, updateCartItemQuantity } from "../../controller/cart/cart.controller.js";

const cartRouter=Router()

cartRouter.get("/", protect, getCart);
cartRouter.post("/", protect, addToCart);
cartRouter.delete("/:productId", protect, removeFromCart);
cartRouter.delete("/", protect, clearCart);
cartRouter.patch("/:productId", protect, updateCartItemQuantity);

export default cartRouter