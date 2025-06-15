import { Router } from "express";
import { expressAdapter } from "../../adapters/express.adapter";
import { restrictTo } from "../middlewares/auth.middleware";
import { RevenueController } from "@/presentation/http/controllers/revenue.controller";

export function revenueRouter(
  revenueController: RevenueController
): Router {
  const router = Router();

  router.get("/overall", restrictTo("ADMIN"), (req, res) =>
    expressAdapter(req, res, (httpRequest) =>
      revenueController.getOverallRevenue(httpRequest)
    )
  );

  router.get("/courses", restrictTo("ADMIN"), (req, res) =>
    expressAdapter(req, res, (httpRequest) =>
      revenueController.getCourseRevenue(httpRequest)
    )
  );

  return router;
}
