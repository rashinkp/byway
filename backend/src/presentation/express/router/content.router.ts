import { Router } from "express";
import { expressAdapter } from "../../adapters/express.adapter";
import { restrictTo } from "../middlewares/auth.middleware";
import { LessonContentController } from "../../http/controllers/content.controller";

export default function lessonContentRouter(
  lessonContentController: LessonContentController
): Router {
  const router = Router();

  router.post("/", restrictTo("INSTRUCTOR"), (req, res, next) =>
    expressAdapter(
      req,
      res,
      lessonContentController.createLessonContent.bind(lessonContentController),
      next
    )
  );

  router.put("/:contentId", restrictTo("INSTRUCTOR"), (req, res, next) =>
    expressAdapter(
      req,
      res,
      lessonContentController.updateLessonContent.bind(lessonContentController),
      next
    )
  );

  router.delete("/:contentId", restrictTo("ADMIN", "INSTRUCTOR"), (req, res, next) =>
    expressAdapter(
      req,
      res,
      lessonContentController.deleteLessonContent.bind(lessonContentController),
      next
    )
  );


  router.get(
    "/:lessonId",
    restrictTo("ADMIN", "USER", "INSTRUCTOR"),
    (req, res, next) =>
      expressAdapter(
        req,
        res,
        lessonContentController.getLessonContentByLessonId.bind(
          lessonContentController
        ),
        next
      )
  );

  return router;
}
