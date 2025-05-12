// src/modules/course/course.route.ts
import { Router } from "express";
import { CourseController } from "./course.controller";
import { adaptCourseController } from "../../adapters/expressCourseAdapters";
import { authMiddleware, optionalAuth, protect } from "../../middlewares/authMiddleware";

export const createCourseRouter = (
  courseController: CourseController
): Router => {
  const router = Router();
  const adapt = adaptCourseController(courseController);

  router.post("/", authMiddleware("INSTRUCTOR"), adapt.createCourse);
  router.get("/", optionalAuth, adapt.getAllCourses);
  router.get("/:id", adapt.getCourseById);
  router.put("/:id", authMiddleware("INSTRUCTOR"), adapt.updateCourse);
  router.delete("/:id", authMiddleware("ADMIN"), adapt.softDeleteCourse);
  router.post("/enroll", authMiddleware('USER'), adapt.enrollCourse);
  router.get("/enrolled", authMiddleware("USER"), adapt.getEnrolledCourses);
  return router;
};
