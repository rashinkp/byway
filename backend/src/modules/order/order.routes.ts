import { Router } from "express";
import { OrderController } from "./order.controller";
import { protect } from "../../middlewares/authMiddleware";
import { adaptOrderController } from "../../adapters/expressOrderAdapters";

export const createOrderouter = (
  orderController: OrderController
): Router => {
  const paymentRouter = Router();
  const adapt = adaptOrderController(orderController);

  paymentRouter.post("/orders", protect, adapt.createOrder);
  paymentRouter.post("/orders/status", adapt.updateOrderStatus);

  return paymentRouter;
};
