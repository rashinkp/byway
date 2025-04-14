// src/modules/lesson/lesson.route.ts
import { Router } from "express";
import { LessonController } from "./lesson.controller";
import { adaptLessonController } from "../../adapters/expressLessonAdapters";
import { authMiddleware, protect } from "../../middlewares/authMiddleware";

export const createLessonRouter = (
  lessonController: LessonController
): Router => {
  const router = Router();
  const adapt = adaptLessonController(lessonController);

  router.post("/", authMiddleware("INSTRUCTOR"), adapt.createLesson);
  router.put(
    "/:courseId/progress/:lessonId",
    protect,
    adapt.updateLessonProgress
  );
  router.get("/:courseId/progress", protect, adapt.getCourseProgress);

  return router;
};
