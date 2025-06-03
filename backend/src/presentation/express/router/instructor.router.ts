import { Router } from "express";
import { restrictTo } from "../middlewares/auth.middleware";
import { InstructorController } from "../../http/controllers/instructor.controller";
import { expressAdapter } from "../../adapters/express.adapter";
import { optionalAuth } from "../middlewares/auth.middleware";

export function instructorRouter(
  instructorController: InstructorController
): Router {
  const router = Router();

  // Get instructors (public with optional admin access)
  router.get("/instructors", (req, res) =>
    expressAdapter(
      req,
      res,
      instructorController.getAllInstructors.bind(instructorController)
    )
  );

  // Get instructor details (public with optional auth)
  router.get("/instructors/:instructorId", optionalAuth, (req, res) =>
    expressAdapter(
      req,
      res,
      instructorController.getInstructorDetails.bind(instructorController)
    )
  );

  // Admin routes
  router.post("/approve", restrictTo("ADMIN"), (req, res) =>
    expressAdapter(
      req,
      res,
      instructorController.approveInstructor.bind(instructorController)
    )
  );

  router.post("/decline", restrictTo("ADMIN"), (req, res) =>
    expressAdapter(
      req,
      res,
      instructorController.declineInstructor.bind(instructorController)
    )
  );

  // User/Instructor routes
  router.post("/create", restrictTo("USER", "INSTRUCTOR"), (req, res) =>
    expressAdapter(
      req,
      res,
      instructorController.createInstructor.bind(instructorController)
    )
  );

  router.put("/update", restrictTo("INSTRUCTOR", "ADMIN"), (req, res) =>
    expressAdapter(
      req,
      res,
      instructorController.updateInstructor.bind(instructorController)
    )
  );

  router.get("/me", restrictTo("INSTRUCTOR", "ADMIN", "USER"), (req, res) =>
    expressAdapter(
      req,
      res,
      instructorController.getInstructorByUserId.bind(instructorController)
    )
  );

  return router;
}
