import { Router } from "express";
import { CartController } from "./cart.controller";
import { protect } from "../../middlewares/authMiddleware";
import { adaptCartController } from "../../adapters/expressCartAdapters";

export const createCartRouter = (cartController: CartController): Router => {
  const router = Router();
  const adapt = adaptCartController(cartController);

  router.post("/", protect, adapt.createCart);
  router.get("/", protect, adapt.getCart);
  router.delete("/:courseId", protect, adapt.removeCartItem);
  router.delete("/", protect, adapt.clearCart);

  return router;
};
