import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { protect } from "../../middlewares/authMiddleware";
import { adaptPaymentController } from "../../adapters/expressPaymentAdapters";

export const createPaymentRouter = (
  paymentController: PaymentController
): Router => {
  const paymentRouter = Router();
  const adapt = adaptPaymentController(paymentController);

  paymentRouter.post("/orders", protect, adapt.createOrder);
  paymentRouter.post("/orders/status", adapt.updateOrderStatus);

  return paymentRouter;
};
