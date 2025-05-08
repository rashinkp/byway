import { Router } from "express";
import { OrderController } from "./order.controller";
import { protect } from "../../middlewares/authMiddleware";
import { adaptPaymentController } from "../../adapters/expressOrderAdapters";

export const createPaymentRouter = (
  orderController: OrderController
): Router => {
  const paymentRouter = Router();
  const adapt = adaptPaymentController(orderController);

  paymentRouter.post("/orders", protect, adapt.createOrder);
  paymentRouter.post("/orders/status", adapt.updateOrderStatus);

  return paymentRouter;
};
