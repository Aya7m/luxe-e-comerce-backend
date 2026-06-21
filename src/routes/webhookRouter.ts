import express from "express";
import { stripeWebhook } from "../controller/webhook.controller.js";

const webhookRouter = express.Router();

webhookRouter.post(
  "/",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

export default webhookRouter;