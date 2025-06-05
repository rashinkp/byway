import { GetAllOrdersUseCase } from "../app/usecases/order/implementations/get-all-orders.use-case";
import { CreateOrderUseCase } from "../app/usecases/order/implementations/create-order.usecase";
import { OrderController } from "../presentation/http/controllers/order.controller";
import { SharedDependencies } from "./shared.dependencies";

export interface OrderDependencies {
  orderController: OrderController;
}

export function createOrderDependencies(
  deps: SharedDependencies
): OrderDependencies {
  const { orderRepository, userRepository, enrollmentRepository, transactionRepository, walletRepository } = deps;

  // Initialize use cases
  const getAllOrdersUseCase = new GetAllOrdersUseCase(orderRepository);
  const createOrderUseCase = new CreateOrderUseCase(
    userRepository,
    orderRepository,
    enrollmentRepository,
    transactionRepository,
    walletRepository
  );

  // Initialize controller
  const orderController = new OrderController(
    getAllOrdersUseCase,
    createOrderUseCase,
    deps.httpErrors,
    deps.httpSuccess
  );

  return {
    orderController,
  };
} 