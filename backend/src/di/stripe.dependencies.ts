import { CreateCheckoutSessionUseCase } from "../app/usecases/stripe/implementations/create-checkout-session.usecase";
import { HandleWebhookUseCase } from "../app/usecases/stripe/implementations/handle-webhook.usecase";
import { StripeController } from "../presentation/http/controllers/stripe.controller";
import { SharedDependencies } from "./shared.dependencies";
import { StripePaymentGateway } from "../infra/providers/stripe-payment.gateway";
import { StripeWebhookGateway } from "../infra/providers/stripe-webhook.gateway";

export interface StripeDependencies {
  stripeController: StripeController;
}

export function createStripeDependencies(
  deps: SharedDependencies
): StripeDependencies {
  const stripeGateway = new StripePaymentGateway();
  const webhookGateway = new StripeWebhookGateway();

  // Initialize use cases
  const createCheckoutSessionUseCase = new CreateCheckoutSessionUseCase(
    deps.userRepository,
    deps.orderRepository,
    deps.enrollmentRepository,
    deps.cartRepository,
    stripeGateway
  );

  const handleWebhookUseCase = new HandleWebhookUseCase(
    webhookGateway,
    deps.userRepository,
    deps.orderRepository,
    deps.enrollmentRepository,
    deps.transactionRepository,
  );

  // Initialize controller
  const stripeController = new StripeController(
    createCheckoutSessionUseCase,
    handleWebhookUseCase,
    deps.httpErrors,
    deps.httpSuccess
  );

  return {
    stripeController,
  };
} 