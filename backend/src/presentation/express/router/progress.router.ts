import { Router } from "express";
import { ProgressController } from "../../http/controllers/progress.controller";
import { expressAdapter } from "../../adapters/express.adapter";
import { restrictTo } from "../middlewares/auth.middleware";

export const progressRouter = (progressController: ProgressController): Router => {
  const router = Router();

  // Update course progress
  router.patch(
    "/:courseId/progress",
    restrictTo("USER", "INSTRUCTOR", "ADMIN"),
    (req, res) => expressAdapter(req, res, progressController.updateProgress.bind(progressController))
  );

  // Get course progress
  router.get(
    "/:courseId/progress",
    restrictTo("USER", "INSTRUCTOR", "ADMIN"),
    (req, res) => expressAdapter(req, res, progressController.getProgress.bind(progressController))
  );


  return router;
}; 