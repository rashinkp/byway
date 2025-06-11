import { CreateOrderUseCase } from "../app/usecases/order/implementations/create-order.usecase";
import { OrderController } from "../presentation/http/controllers/order.controller";
import { SharedDependencies } from "./shared.dependencies";
import { PaymentService } from "../app/services/payment/implementations/payment.service";
import { StripePaymentGateway } from "../infra/providers/stripe-payment.gateway";
import { StripeWebhookGateway } from "../infra/providers/stripe-webhook.gateway";
import { GetAllOrdersUseCase } from "../app/usecases/order/implementations/get-all-orders.use-case";
import { CreateTransactionUseCase } from "../app/usecases/transaction/implementations/create-transaction.usecase";
import { RetryOrderUseCase } from "../app/usecases/order/implementations/retry-order.usecase";

export interface OrderDependencies {
  orderController: OrderController;
}

export function createOrderDependencies(
  deps: SharedDependencies
): OrderDependencies {
  const stripeGateway = new StripePaymentGateway();
  const webhookGateway = new StripeWebhookGateway();

  // Initialize payment service
  const paymentService = new PaymentService(
    deps.walletRepository,
    deps.orderRepository,
    deps.transactionRepository,
    deps.enrollmentRepository,
    stripeGateway,
    webhookGateway,
    deps.userRepository
  );

  // Initialize use cases
  const createTransactionUseCase = new CreateTransactionUseCase(deps.transactionRepository);
  const createOrderUseCase = new CreateOrderUseCase(
    deps.orderRepository,
    paymentService,
    createTransactionUseCase
  );

  const getAllOrdersUseCase = new GetAllOrdersUseCase(deps.orderRepository);
  const retryOrderUseCase = new RetryOrderUseCase(
    deps.orderRepository,
    paymentService,
    createTransactionUseCase
  );

  // Initialize controller
  const orderController = new OrderController(
    getAllOrdersUseCase,
    createOrderUseCase,
    retryOrderUseCase,
    deps.httpErrors,
    deps.httpSuccess
  );

  return {
    orderController,
  };
}
