import { Router } from "express";
import { EnrollmentController } from "./enrollment.controller";
import { protect } from "../../middlewares/authMiddleware";
import { adaptEnrollmentController } from "../../adapters/expressEnrollmentAdapters";

export const createEnrollmentRouter = (
  enrollmentController: EnrollmentController
): Router => {
  const enrollmentRouter = Router();
  const adapt = adaptEnrollmentController(enrollmentController);

  enrollmentRouter.post("/", protect, adapt.createEnrollment);
  enrollmentRouter.get("/:courseId", protect, adapt.getEnrollment);
  enrollmentRouter.patch("/access-status", protect, adapt.updateAccessStatus);

  return enrollmentRouter;
};
