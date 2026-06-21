import { Router } from "express";
import { createReview, getProductReview } from "../../controller/reviews/review.controller.js";
import { protect } from "../../middleware/auth.middleware.js";



const reviewRouter = Router();

reviewRouter.get("/:productId", getProductReview);
reviewRouter.post("/:productId", protect, createReview);

export default reviewRouter;