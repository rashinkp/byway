import { GetAllOrdersUseCase } from "../app/usecases/order/implementations/get-all-orders.use-case";
import { OrderController } from "../presentation/http/controllers/order.controller";
import { SharedDependencies } from "./shared.dependencies";

export interface OrderDependencies {
  orderController: OrderController;
}

export function createOrderDependencies(
  deps: SharedDependencies
): OrderDependencies {
  const { orderRepository } = deps;

  // Initialize use cases
  const getAllOrdersUseCase = new GetAllOrdersUseCase(orderRepository);

  // Initialize controller
  const orderController = new OrderController(
    getAllOrdersUseCase,
    deps.httpErrors,
    deps.httpSuccess
  );

  return {
    orderController,
  };
} 