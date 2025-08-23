import { StripeController } from "../presentation/http/controllers/stripe.controller";
import { SharedDependencies } from "./shared.dependencies";

export interface StripeDependencies {
  stripeController: StripeController;
}

export const createStripeDependencies = (sharedDeps: SharedDependencies): StripeDependencies => {
  const { httpErrors, httpSuccess, paymentService, getEnrollmentStatsUseCase, enrollmentRepository } = sharedDeps;

  const stripeController = new StripeController(
    paymentService,
    getEnrollmentStatsUseCase,
    enrollmentRepository,
    httpErrors,
    httpSuccess
  );

  return {
    stripeController
  };
}; 