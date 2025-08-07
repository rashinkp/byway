import { CheckoutSessionRepository } from "../infra/repositories/checkout-session.repository.imp";
import { createSharedDependencies } from "./shared.dependencies";
import { CheckoutSessionUseCases } from "../app/usecases/checkout-session/checkout-session.usecase";




export function getCheckoutSessionDependencies(sharedDeps?: ReturnType<typeof createSharedDependencies>) {
  const deps = sharedDeps || createSharedDependencies();
  const checkoutSessionRepository = new CheckoutSessionRepository();
  const checkoutSessionUseCases = new CheckoutSessionUseCases(
    checkoutSessionRepository,
  );

  return {
    checkoutSessionRepository,
    checkoutSessionUseCases
  };
}