import { Router } from "express";
import { StripeController } from "../../http/controllers/stripe.controller";
import { expressAdapter } from "../../adapters/express.adapter";
import { restrictTo } from "../middlewares/auth.middleware";
import { StripeRoutes } from "../../../common/routes";

export function stripeRouter(stripeController: StripeController): Router {
  const router = Router();

  router.post(
    StripeRoutes.CREATE_CHECKOUT_SESSION,
    restrictTo("USER", "INSTRUCTOR", "ADMIN"),
    (req, res, next) =>
      expressAdapter(req, res, stripeController.createCheckoutSession.bind(stripeController), next)
  );

  router.post(
    StripeRoutes.RELEASE_CHECKOUT_LOCK,
    restrictTo("USER", "INSTRUCTOR", "ADMIN"),
    (req, res, next) =>
      expressAdapter(req, res, stripeController.releaseCheckoutLock.bind(stripeController), next)
  );

  return router;
} 