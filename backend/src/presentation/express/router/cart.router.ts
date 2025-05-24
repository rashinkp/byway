import { Router } from "express";
import { CartController } from "../../http/controllers/cart.controller";
import { expressAdapter } from "../../adapters/express.adapter";
import { restrictTo } from "../middlewares/auth.middleware";

export function cartRouter(cartController: CartController): Router {
  const router = Router();

  router.use(restrictTo("USER", "INSTRUCTOR", "ADMIN"));

  // Cart routes
  router.post("/", (req, res) => 
    expressAdapter(req, res, cartController.addToCart.bind(cartController))
  );
  router.get("/", (req, res) => 
    expressAdapter(req, res, cartController.getCart.bind(cartController))
  );
  router.delete("/:courseId", (req, res) => 
    expressAdapter(req, res, cartController.removeFromCart.bind(cartController))
  );
  router.post("/apply-coupon", (req, res) => 
    expressAdapter(req, res, cartController.applyCoupon.bind(cartController))
  );
  router.delete("/", (req, res) => 
    expressAdapter(req, res, cartController.clearCart.bind(cartController))
  );

  return router;
} 