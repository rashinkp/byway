import { Router } from "express";
import { CategoryController } from "../../http/controllers/category.controller";

export default function categoryRouter(
  categoryController: CategoryController
): Router {
  const router = Router();

  router.post("/", (req, res, next) =>
    categoryController.createCategory(req, res, next)
  );
  router.get("/", (req, res, next) =>
    categoryController.getAllCategories(req, res, next)
  );
  router.get("/:id", (req, res, next) =>
    categoryController.getCategoryById(req, res, next)
  );
  router.put("/:id", (req, res, next) =>
    categoryController.updateCategory(req, res, next)
  );
  router.delete("/:id", (req, res, next) =>
    categoryController.deleteCategory(req, res, next)
  );
  router.patch("/:id/recover", (req, res, next) =>
    categoryController.recoverCategory(req, res, next)
  );

  return router;
}
