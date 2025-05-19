import { Router } from "express";
import { InstructorController } from "../../http/controllers/instructor.controller";
import { restrictTo } from "../middlewares/auth.middleware";

export function instructorRouter(instructorController: InstructorController): Router {
  const router = Router();

  // Admin routes
  router.get(
    "/admin/instructors",
    restrictTo("ADMIN"),
    instructorController.getAllInstructors.bind(instructorController)
  );

  router.post(
    "/approve",
    restrictTo("ADMIN"),
    instructorController.approveInstructor.bind(instructorController)
  );

  router.post(
    "/decline",
    restrictTo("ADMIN"),
    instructorController.declineInstructor.bind(instructorController)
  );

  // User/Instructor routes
  router.post(
    "/create",
    restrictTo("USER", "INSTRUCTOR"),
    instructorController.createInstructor.bind(instructorController)
  );

  router.put(
    "/update",
    restrictTo("INSTRUCTOR", "ADMIN"),
    instructorController.updateInstructor.bind(instructorController)
  );

  router.get(
    "/me",
    restrictTo("INSTRUCTOR", "ADMIN" , "USER"),
    instructorController.getInstructorByUserId.bind(instructorController)
  );

  return router;
}
