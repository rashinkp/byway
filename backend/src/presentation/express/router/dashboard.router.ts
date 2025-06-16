import { Router } from "express";
import { expressAdapter } from "../../adapters/express.adapter";
import { restrictTo } from "../middlewares/auth.middleware";
import { DashboardController } from "../../http/controllers/dashboard.controller";

export function dashboardRouter(
  dashboardController: DashboardController
): Router {
  const router = Router();

  // GET /dashboard/admin - Get admin dashboard data
  router.get("/admin", restrictTo("ADMIN"), (req, res) =>
    expressAdapter(req, res, (httpRequest) =>
      dashboardController.getDashboard(httpRequest)
    )
  );

  // GET /dashboard/instructor - Get instructor dashboard data
  router.get("/instructor", restrictTo("INSTRUCTOR"), (req, res) =>
    expressAdapter(req, res, (httpRequest) =>
      dashboardController.getInstructorDashboard(httpRequest)
    )
  );

  return router;
}
