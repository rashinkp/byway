import { Router } from "express";
import { CartController } from "../../http/controllers/cart.controller";
import { expressAdapter } from "../../adapters/express.adapter";
import { restrictTo } from "../middlewares/auth.middleware";

export function cartRouter(cartController: CartController): Router {
  const router = Router();

  router.use(restrictTo("USER", "INSTRUCTOR", "ADMIN"));

  // Cart routes
  router.post("/", (req, res, next) => 
    expressAdapter(req, res, cartController.addToCart.bind(cartController), next)
  );
  router.get("/", (req, res, next) => 
    expressAdapter(req, res, cartController.getCart.bind(cartController), next)
  );
  router.post("/apply-coupon", (req, res, next) => 
    expressAdapter(req, res, cartController.applyCoupon.bind(cartController), next)
  );
  router.delete("/", (req, res, next) => 
    expressAdapter(req, res, cartController.clearCart.bind(cartController), next)
  );
  router.delete("/:courseId", (req, res, next) => 
    expressAdapter(req, res, cartController.removeFromCart.bind(cartController), next)
  );

  return router;
} 