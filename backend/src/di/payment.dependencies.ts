import { CreateStripeCheckoutSessionUseCase } from "../app/usecases/payment/implementations/create-stripe-checkout-session.usecase";
import { HandleWalletPaymentUseCase } from "../app/usecases/payment/implementations/handle-wallet-payment.usecase";
import { HandleStripeWebhookUseCase } from "../app/usecases/payment/implementations/handle-stripe-webhook.usecase";
import { DistributeRevenueUseCase } from "../app/usecases/revenue-distribution/implementations/distribute-revenue.usecase";

export interface PaymentDependencies {
  createStripeCheckoutSessionUseCase: CreateStripeCheckoutSessionUseCase;
  handleWalletPaymentUseCase: HandleWalletPaymentUseCase;
  handleStripeWebhookUseCase: HandleStripeWebhookUseCase;
  distributeRevenueUseCase: DistributeRevenueUseCase;
}
