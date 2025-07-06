import { Router } from "express";
import { expressAdapter } from "../../adapters/express.adapter";
import { restrictTo } from "../middlewares/auth.middleware";
import { DashboardController } from "../../http/controllers/dashboard.controller";

export function dashboardRouter(
  dashboardController: DashboardController
): Router {
  const router = Router();

  // GET /dashboard/admin - Get admin dashboard data
  router.get("/admin", restrictTo("ADMIN"), (req, res , next) =>
    expressAdapter(req, res, (httpRequest) =>
      dashboardController.getDashboard(httpRequest) , next
    )
  );

  // GET /dashboard/instructor - Get instructor dashboard data
  router.get("/instructor", restrictTo("INSTRUCTOR"), (req, res , next) =>
    expressAdapter(req, res, (httpRequest) =>
      dashboardController.getInstructorDashboard(httpRequest) , next
    )
  );

  return router;
}
