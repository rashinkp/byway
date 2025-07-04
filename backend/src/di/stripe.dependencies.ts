import { StripeController } from "../presentation/http/controllers/stripe.controller";
import { SharedDependencies } from "./shared.dependencies";

export interface StripeDependencies {
  stripeController: StripeController;
}

export const createStripeDependencies = (sharedDeps: SharedDependencies): StripeDependencies => {
  const { httpErrors, httpSuccess, paymentService } = sharedDeps;

  const stripeController = new StripeController(
    paymentService,
    httpErrors,
    httpSuccess
  );

  return {
    stripeController
  };
}; 