import { Router } from "express";
import { adaptInstructorController } from "../../adapters/expressInstructorAdapters";
import { InstructorController } from "./instructor.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";

export const createInstructorRouter = (
  instructorController: InstructorController
): Router => {
  const instructorRouter = Router();
  const adapt = adaptInstructorController(instructorController);

  instructorRouter.post(
    "/create",
    authMiddleware("USER"),
    adapt.createInstructor
  );

  instructorRouter.post(
    "/approve",
    authMiddleware("ADMIN"),
    adapt.approveInstructor
  );

  instructorRouter.post(
    "/decline",
    authMiddleware("ADMIN"),
    adapt.declineInstructor
  );

  instructorRouter.get(
    "/all",
    authMiddleware("ADMIN"),
    adapt.getAllInstructors
  );

  return instructorRouter;
};
