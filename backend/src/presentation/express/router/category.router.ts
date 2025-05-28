import { Router } from "express";
import { restrictTo } from "../middlewares/auth.middleware";
import { CategoryController } from "../../http/controllers/category.controller";
import { expressAdapter } from "../../adapters/express.adapter";

export default function categoryRouter(
  categoryController: CategoryController
): Router {
  const router = Router();

  router.post("/", restrictTo("ADMIN"), (req, res) =>
    expressAdapter(
      req,
      res,
      categoryController.createCategory.bind(categoryController)
    )
  );
  router.get("/", (req, res) =>
    expressAdapter(
      req,
      res,
      categoryController.getAllCategories.bind(categoryController)
    )
  );
  router.get("/:id", (req, res) =>
    expressAdapter(
      req,
      res,
      categoryController.getCategoryById.bind(categoryController)
    )
  );
  router.put("/:id", (req, res) =>
    expressAdapter(
      req,
      res,
      categoryController.updateCategory.bind(categoryController)
    )
  );
  router.delete("/:categoryId", (req, res) =>
    expressAdapter(
      req,
      res,
      categoryController.deleteCategory.bind(categoryController)
    )
  );
  router.patch("/:categoryId/recover", (req, res) =>
    expressAdapter(
      req,
      res,
      categoryController.recoverCategory.bind(categoryController)
    )
  );

  return router;
}
