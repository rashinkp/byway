import { Router } from "express";
import { CartController } from "./cart.controller";
import { protect } from "../../middlewares/authMiddleware";
import { adaptCartController } from "../../adapters/expressCartAdapters";

export const createCartRouter = (cartController: CartController): Router => {
  const router = Router();
  const adapt = adaptCartController(cartController);

  router.post("/cart", protect, adapt.createCart);
  router.get("/cart", protect, adapt.getCart);
  router.delete("/cart/:courseId", protect, adapt.removeCartItem);
  router.delete("/cart", protect, adapt.clearCart);

  return router;
};
