import { StripeController } from "../presentation/http/controllers/stripe.controller";
import { SharedDependencies } from "./shared.dependencies";
import { PaymentDependencies } from "./payment.dependencies";

export interface StripeDependencies {
  stripeController: StripeController;
}

export const createStripeDependencies = (sharedDeps: SharedDependencies, paymentDeps: PaymentDependencies): StripeDependencies => {
  const { httpErrors, httpSuccess, getEnrollmentStatsUseCase, enrollmentRepository } = sharedDeps;

  const stripeController = new StripeController(
    {
      handleWalletPayment: paymentDeps.handleWalletPaymentUseCase.execute.bind(paymentDeps.handleWalletPaymentUseCase),
      createStripeCheckoutSession: paymentDeps.createStripeCheckoutSessionUseCase.execute.bind(paymentDeps.createStripeCheckoutSessionUseCase),
      handleStripeWebhook: paymentDeps.handleStripeWebhookUseCase.execute.bind(paymentDeps.handleStripeWebhookUseCase),
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