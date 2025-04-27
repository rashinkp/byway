import { Router } from "express";
import { ContentController } from "./content.controller";
import { adaptContentController } from "../../adapters/expressContentAdapters";
import { authMiddleware, protect } from "../../middlewares/authMiddleware";

export const createContentRouter = (
  contentController: ContentController
): Router => {
  const router = Router();
  const adapt = adaptContentController(contentController);

  router.post("/", authMiddleware("INSTRUCTOR"), adapt.createContent);
  router.get("/:lessonId", protect, adapt.getContentByLessonId);
  router.patch("/:id", authMiddleware("INSTRUCTOR"), adapt.updateContent);
  router.delete("/:id", authMiddleware("INSTRUCTOR"), adapt.deleteContent);

  return router;
};
