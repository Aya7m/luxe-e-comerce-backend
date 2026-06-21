import type { Response } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware.js";
import { Review } from "../../modules/reviews/review.model.js";

export const getProductReview=async(req:AuthRequest,res:Response):Promise<void>=>{
    try {
        
        const allReviews=await Review.find({product:req.params.productId}).sort({createdAt:-1})
        res.json(allReviews)
    } catch (error) {
        res.status(500).json({ message: "Failed to get reviews" });
    }

}

export const createReview=async(req:AuthRequest,res:Response):Promise<void>=>{
    try {
        
        const review=await Review.create({
            product:req.params.productId,
            user:req.user?.userId,
            userName:req.body.userName,
            rating:req.body.rating,
            comment: req.body.comment,
        })
        res.status(201).json(review);
    } catch (error) {
          res.status(500).json({ message: "Failed to create review" });
        
    }

}