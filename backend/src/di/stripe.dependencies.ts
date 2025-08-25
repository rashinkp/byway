import { StripeController } from "../presentation/http/controllers/stripe.controller";
import { SharedDependencies } from "./shared.dependencies";

export interface StripeDependencies {
  stripeController: StripeController;
}

export const createStripeDependencies = (sharedDeps: SharedDependencies, appDeps: any): StripeDependencies => {
  const { httpErrors, httpSuccess, getEnrollmentStatsUseCase, enrollmentRepository } = sharedDeps;

  const stripeController = new StripeController(
    {
      handleWalletPayment: appDeps.handleWalletPaymentUseCase.execute.bind(appDeps.handleWalletPaymentUseCase),
      createStripeCheckoutSession: appDeps.createStripeCheckoutSessionUseCase.execute.bind(appDeps.createStripeCheckoutSessionUseCase),
      handleStripeWebhook: appDeps.handleStripeWebhookUseCase.execute.bind(appDeps.handleStripeWebhookUseCase),
    },
    getEnrollmentStatsUseCase,
    enrollmentRepository,
    httpErrors,
    httpSuccess
  );

  return {
    stripeController
  };
}; 