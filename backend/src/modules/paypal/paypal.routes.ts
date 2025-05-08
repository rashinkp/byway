import { Router } from "express";
import { PaypalController } from "./paypal.controller";
import { protect } from "../../middlewares/authMiddleware";
import { adaptPaypalController } from "../../adapters/expressPaypalAdapters";



export const createPaypalRouter = (controller: PaypalController): Router => {
  const router = Router();
  const adapt = adaptPaypalController(controller);
  router.post(
    "/createorder",
    protect,
    adapt.createOrder
  );

  router.post(
    "/captureorder",
    protect,
   adapt.captureOrder
  );

  return router;
};
