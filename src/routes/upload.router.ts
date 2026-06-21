import { Router } from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { adminOnly, protect } from "../middleware/auth.middleware.js";



const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", protect, adminOnly, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "No image uploaded" });
      return;
    }

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "luxury-products" },
        (error, result) => {
          if (error || !result) {
            reject(error);
            return;
          }

          resolve(result as { secure_url: string });
        }
      );

      stream.end(req.file!.buffer);
    });

    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.log("CLOUDINARY UPLOAD ERROR:", error);
    res.status(500).json({ message: "Upload failed", error });
  }
});

export default router;