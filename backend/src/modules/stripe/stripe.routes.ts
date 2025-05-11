import express, { Router } from "express";
import { StripeController } from "./stripe.controller";
import { protect } from "../../middlewares/authMiddleware";
import { adaptStripeController } from "../../adapters/expressStripeAdapters";
import cors from "cors";
export const createStripeRouter = (controller: StripeController): Router => {
  const router = Router();
  const adapt = adaptStripeController(controller);

  // Protected route for creating Checkout Sessions
  router.post(
    "/create-checkout-session",
    cors({ origin: process.env.CORS_ORIGIN, credentials: true }),
    express.json(),
    protect,
    adapt.createCheckoutSession
  );

  return router;
};
