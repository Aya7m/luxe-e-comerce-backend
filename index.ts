import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./src/config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./src/routes/auth/auth.router.js";
import productRouter from "./src/routes/products/product.routes.js";
import orderRouter from "./src/routes/orders/order.router.js";
import cartRouter from "./src/routes/cart/cart.router.js";
import uploadRoutes from "./src/routes/upload.router.js";
import reviewRouter from "./src/routes/reviews/review.routes.js";
import wishlistRoutes from "./src/routes/wishlist/wishlist.router.js";
import { stripeWebhook } from "./src/controller/webhook.controller.js";
import webhookRouter from "./src/routes/webhookRouter.js";
import chatRouter from "./src/routes/chat/chat.router.js";
import adminRouter from "./src/routes/admin/admin.router.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "https://luxe-e-commerce-frontend-lke6.vercel.app",
    credentials: true,
  }),
);


app.use("/api/webhooks", webhookRouter);

app.use(express.json());
app.use(cookieParser());


connectDB();
app.use('/api/auth',authRouter);
app.use('/api/products',productRouter);
app.use('/api/orders',orderRouter)
app.use('/api/cart',cartRouter)
app.use("/api/upload", uploadRoutes);
app.use('/api/reviews',reviewRouter)
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/chat", chatRouter);
app.use("/api/admin", adminRouter);
app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
