// src/modules/course/course.route.ts
import { Router } from "express";
import { CourseController } from "./course.controller";
import { adaptCourseController } from "../../adapters/expressCourseAdapters";
import { authMiddleware, protect } from "../../middlewares/authMiddleware";

export const createCourseRouter = (
  courseController: CourseController
): Router => {
  const router = Router();
  const adapt = adaptCourseController(courseController);

  router.post("/", authMiddleware("INSTRUCTOR"), adapt.createCourse);
  router.get("/", protect, adapt.getAllCourses);
  router.get("/:id", protect, adapt.getCourseById);
  router.put("/:id", authMiddleware("INSTRUCTOR"), adapt.updateCourse);
  router.delete("/:id", authMiddleware("INSTRUCTOR"), adapt.softDeleteCourse);

  return router;
};
