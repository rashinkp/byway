import { CreateOrderUseCase } from "../app/usecases/order/implementations/create-order.usecase";
import { OrderController } from "../presentation/http/controllers/order.controller";
import { SharedDependencies } from "./shared.dependencies";
import { GetAllOrdersUseCase } from "../app/usecases/order/implementations/get-all-orders.use-case";
import { CreateTransactionUseCase } from "../app/usecases/transaction/implementations/create-transaction.usecase";
import { RetryOrderUseCase } from "../app/usecases/order/implementations/retry-order.usecase";

export interface OrderDependencies {
  orderController: OrderController;
}

export function createOrderDependencies(
  deps: SharedDependencies
): OrderDependencies {
  // Initialize use cases
  const createTransactionUseCase = new CreateTransactionUseCase(deps.transactionRepository);
  const createOrderUseCase = new CreateOrderUseCase(
    deps.orderRepository,
    deps.paymentService,
    createTransactionUseCase
  );

  const getAllOrdersUseCase = new GetAllOrdersUseCase(deps.orderRepository);
  const retryOrderUseCase = new RetryOrderUseCase(
    deps.orderRepository,
    deps.paymentService,
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
