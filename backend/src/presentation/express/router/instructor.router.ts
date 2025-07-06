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
  router.get("/instructors", (req, res, next) =>
    expressAdapter(
      req,
      res,
      instructorController.getAllInstructors.bind(instructorController),
      next
    )
  );

  // Admin routes
  router.post("/approve", restrictTo("ADMIN"), (req, res, next) =>
    expressAdapter(
      req,
      res,
      instructorController.approveInstructor.bind(instructorController),
      next
    )
  );

  router.post("/decline", restrictTo("ADMIN"), (req, res, next) =>
    expressAdapter(
      req,
      res,
      instructorController.declineInstructor.bind(instructorController),
      next
    )
  );

  // User/Instructor routes
  router.post("/create", restrictTo("USER", "INSTRUCTOR"), (req, res, next) =>
    expressAdapter(
      req,
      res,
      instructorController.createInstructor.bind(instructorController),
      next
    )
  );

  router.put("/update", restrictTo("INSTRUCTOR", "ADMIN"), (req, res, next) =>
    expressAdapter(
      req,
      res,
      instructorController.updateInstructor.bind(instructorController),
      next
    )
  );

  // Get current user's instructor data (must come before /:userId)
  router.get("/me", restrictTo("INSTRUCTOR", "ADMIN", "USER"), (req, res, next) =>
    expressAdapter(
      req,
      res,
      instructorController.getInstructorByUserId.bind(instructorController),
      next
    )
  );

  // Get instructor details (public with optional auth) - must come after specific routes
  router.get("/:userId", optionalAuth, (req, res, next) =>
    expressAdapter(
      req,
      res,
      instructorController.getInstructorDetails.bind(instructorController),
      next
    )
  );

  return router;
}
