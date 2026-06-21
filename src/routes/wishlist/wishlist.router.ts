import { Router } from "express";
import { getWishlist, toggleWishlist } from "../../controller/whishlist/whishlist.controller.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", protect, getWishlist);
router.post("/:productId", protect, toggleWishlist);

export default router;