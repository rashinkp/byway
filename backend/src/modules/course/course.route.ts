// src/modules/course/course.route.ts
import { Router } from "express";
import { CourseController } from "./course.controller";
import { adaptCourseController } from "../../adapters/expressCourseAdapters";
import {
  authMiddleware,
  optionalAuth,
} from "../../middlewares/authMiddleware";

export const createCourseRouter = (
  courseController: CourseController
): Router => {
  const router = Router();
  const adapt = adaptCourseController(courseController);

  router.post("/enroll", authMiddleware("USER"), adapt.enrollCourse);
  router.get("/enrolled", authMiddleware("USER"), adapt.getEnrolledCourses);

  router.post("/", authMiddleware("INSTRUCTOR"), adapt.createCourse);
  router.get("/", optionalAuth, adapt.getAllCourses);
  router.get("/:id", optionalAuth , adapt.getCourseById);
  router.put("/:id", authMiddleware("INSTRUCTOR"), adapt.updateCourse);
  router.delete("/:id", authMiddleware("ADMIN"), adapt.softDeleteCourse);

  return router;
};
