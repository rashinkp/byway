import { CreateCheckoutSessionUseCase } from "../app/usecases/stripe/implementations/create-checkout-session.usecase";
import { HandleWebhookUseCase } from "../app/usecases/stripe/implementations/handle-webhook.usecase";
import { StripeController } from "../presentation/http/controllers/stripe.controller";
import { SharedDependencies } from "./shared.dependencies";

export interface StripeDependencies {
  stripeController: StripeController;
}

export function createStripeDependencies(
  deps: SharedDependencies
): StripeDependencies {

  // Initialize use cases
  const createCheckoutSessionUseCase = new CreateCheckoutSessionUseCase(
    deps.userRepository,
    deps.orderRepository,
    deps.enrollmentRepository,
    deps.cartRepository
  );

  const handleWebhookUseCase = new HandleWebhookUseCase(
    deps.userRepository,
    deps.orderRepository,
    deps.enrollmentRepository,
    deps.transactionRepository
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