import { Router } from "express";
import { expressAdapter } from "../../adapters/express.adapter";
import { restrictTo } from "../middlewares/auth.middleware";
import { LessonContentController } from "../../http/controllers/content.controller";

export default function lessonContentRouter(
  lessonContentController: LessonContentController
): Router {
  const router = Router();

  // Admin-only endpoints
  router.post("/", restrictTo("INSTRUCTOR"), (req, res) =>
    expressAdapter(
      req,
      res,
      lessonContentController.createLessonContent.bind(lessonContentController)
    )
  );

  router.put("/:contentId", restrictTo("INSTRUCTOR"), (req, res) =>
    expressAdapter(
      req,
      res,
      lessonContentController.updateLessonContent.bind(lessonContentController)
    )
  );

  router.delete("/:contentId", restrictTo("ADMIN", "INSTRUCTOR"), (req, res) =>
    expressAdapter(
      req,
      res,
      lessonContentController.deleteLessonContent.bind(lessonContentController)
    )
  );


  router.get(
    "/lessons/:lessonId/content",
    restrictTo("ADMIN", "USER", "INSTRUCTOR"),
    (req, res) =>
      expressAdapter(
        req,
        res,
        lessonContentController.getLessonContentByLessonId.bind(
          lessonContentController
        )
      )
  );

  return router;
}
