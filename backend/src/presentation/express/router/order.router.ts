import { Router } from "express";
import { OrderController } from "../../http/controllers/order.controller";
import { expressAdapter } from "../../adapters/express.adapter";
import { restrictTo } from "../middlewares/auth.middleware";

export function orderRouter(orderController: OrderController): Router {
  const router = Router();

  // Get all orders for the authenticated user
  router.get("/", restrictTo("USER", "ADMIN"), (req, res) =>
    expressAdapter(
      req,
      res,
      orderController.getAllOrders.bind(orderController)
    )
  );

  return router;
} 