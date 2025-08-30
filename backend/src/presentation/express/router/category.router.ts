import { Router } from "express";
import { restrictTo } from "../middlewares/auth.middleware";
import { CategoryController } from "../../http/controllers/category.controller";
import { expressAdapter } from "../../adapters/express.adapter";

export default function categoryRouter(
  categoryController: CategoryController
): Router {
  const router = Router();

  router.post("/", restrictTo("ADMIN"), (req, res, next) =>
    expressAdapter(
      req,
      res,
      categoryController.createCategory.bind(categoryController),
      next
    )
  );
  router.get("/", (req, res, next) =>
    expressAdapter(
      req,
      res,
      categoryController.getAllCategories.bind(categoryController),
      next
    )
  );
  router.get("/:categoryId", (req, res, next) =>
    expressAdapter(
      req,
      res,
      categoryController.getCategoryById.bind(categoryController),
      next
    )
  );
  router.put("/:categoryId", restrictTo("ADMIN"), (req, res, next) =>
    expressAdapter(
      req,
      res,
      categoryController.updateCategory.bind(categoryController),
      next
    )
  );
  router.delete("/:categoryId", restrictTo("ADMIN"), (req, res, next) =>
    expressAdapter(
      req,
      res,
      categoryController.deleteCategory.bind(categoryController),
      next
    )
  );
  router.patch("/:categoryId/recover", restrictTo("ADMIN"), (req, res, next) =>
    expressAdapter(
      req,
      res,
      categoryController.recoverCategory.bind(categoryController),
      next
    )
  );

  return router;
}
