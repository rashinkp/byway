import { Router } from "express";
import { StripeController } from "../../http/controllers/stripe.controller";
import { expressAdapter } from "../../adapters/express.adapter";
import { restrictTo } from "../middlewares/auth.middleware";

export const stripeRouter = (stripeController: StripeController): Router => {
  const router = Router();

  router.post(
    "/create-checkout-session",
    restrictTo("USER", "INSTRUCTOR", "ADMIN"),
    (req, res) => expressAdapter(req, res, stripeController.createCheckoutSession.bind(stripeController))
  );

  return router;
}; 