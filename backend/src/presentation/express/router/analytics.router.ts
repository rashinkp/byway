import { Router } from "express";
import { expressAdapter } from "../../adapters/express.adapter";
import { restrictTo } from "../middlewares/auth.middleware";
import { GetRevenueAnalyticsController } from "../../http/controllers/analytics.controller";

export function revenueRouter(revenueController: GetRevenueAnalyticsController): Router {
  const router = Router();

  router.get(
    "/analytics",
    restrictTo("ADMIN"),
    (req, res) => expressAdapter(req, res, (httpRequest) => revenueController.handle(httpRequest))
  );

  return router;
} 