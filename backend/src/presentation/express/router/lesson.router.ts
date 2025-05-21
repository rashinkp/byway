import { Router } from "express";
import { LessonController } from "../../http/controllers/lesson.controller";
import { expressAdapter } from "../../adapters/express.adapter";
import { restrictTo } from "../middlewares/auth.middleware";
export default function lessonRouter(
  lessonController: LessonController
): Router {
  const router = Router();

  router.post("/", restrictTo('ADMIN'), (req, res) =>
    expressAdapter(
      req,
      res,
      lessonController.createLesson.bind(lessonController)
    )
  );

  router.put("/:lessonId", restrictTo("ADMIN"), (req, res) =>
    expressAdapter(
      req,
      res,
      lessonController.updateLesson.bind(lessonController)
    )
  );

  router.delete("/:lessonId", restrictTo("ADMIN"), (req, res) =>
    expressAdapter(
      req,
      res,
      lessonController.deleteLesson.bind(lessonController)
    )
  );

  // Authenticated user endpoints
  router.get("/:lessonId", restrictTo('ADMIN' , 'USER' , 'INSTRUCTOR'), (req, res) =>
    expressAdapter(
      req,
      res,
      lessonController.getLessonById.bind(lessonController)
    )
  );

  router.get(
    "/courses/:courseId/lessons",
    restrictTo("ADMIN", "USER", "INSTRUCTOR"),
    (req, res) =>
      expressAdapter(
        req,
        res,
        lessonController.getAllLessons.bind(lessonController)
      )
  );

  router.get("/courses/:courseId/public-lessons", (req, res) =>
    expressAdapter(
      req,
      res,
      lessonController.getPublicLessons.bind(lessonController)
    )
  );

  return router;
}
