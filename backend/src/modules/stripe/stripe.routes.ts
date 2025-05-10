import express, { Router } from "express";
import { StripeController } from "./stripe.controller";
import { protect } from "../../middlewares/authMiddleware";
import { adaptStripeController } from "../../adapters/expressStripeAdapters";

export const createStripeRouter = (controller: StripeController): Router => {
  const router = Router();
  const adapt = adaptStripeController(controller);

  // Protected route for creating Checkout Sessions
  router.post("/create-checkout-session",express.json(), protect, adapt.createCheckoutSession);

  // Webhook route with raw body parsing
  router.post(
    "/webhook",
    express.raw({ type: "application/json" }), // Ensure raw body for Stripe
    adapt.handleWebhook
  );

  return router;
};
