import { Router } from "express";
import { OrderController } from "../../http/controllers/order.controller";
import { expressAdapter } from "../../adapters/express.adapter";
import { restrictTo } from "../middlewares/auth.middleware";

export function orderRouter(orderController: OrderController): Router {
  const router = Router();

  // Get all orders for the authenticated user
  router.get("/", restrictTo("USER", "ADMIN"), (req, res , next) =>
    expressAdapter(
      req,
      res,
      orderController.getAllOrders.bind(orderController) ,next
    )
  );

  // Create a new order
  router.post("/", restrictTo("USER"), (req, res, next) =>
    expressAdapter(req, res, orderController.createOrder.bind(orderController), next)
  );

  // Retry a failed order
  router.post("/:orderId/retry", restrictTo("USER"), (req, res , next) =>
    expressAdapter(
      req,
      res,
      orderController.retryOrder.bind(orderController),
      next
    )
  );

  return router;
} 