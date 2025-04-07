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

  return instructorRouter;
};
