import { Router } from "express";
import { expressAdapter } from "../../adapters/express.adapter";
import { restrictTo } from "../middlewares/auth.middleware";
import { RevenueController } from "../../http/controllers/revenue.controller";

export function revenueRouter(
  revenueController: RevenueController
): Router {
  const router = Router();

  router.get("/overall", restrictTo("ADMIN", "INSTRUCTOR"), (req, res) =>
    expressAdapter(req, res, (httpRequest) =>
      revenueController.getOverallRevenue(httpRequest)
    )
  );

  router.get("/courses", restrictTo("ADMIN", "INSTRUCTOR"), (req, res) =>
    expressAdapter(req, res, (httpRequest) =>
      revenueController.getCourseRevenue(httpRequest)
    )
  );

  router.get("/latest", restrictTo("ADMIN", 'INSTRUCTOR'), (req, res) =>
    expressAdapter(req, res, (httpRequest) =>
      revenueController.getLatestRevenue(httpRequest)
    )
  );

  return router;
}
