import { Router } from "express";
import { CategoryController } from "./category.controller";
import { adaptCategoryController } from "../../adapters/expressCategoryAdapters";
import { authMiddleware, protect } from "../../middlewares/authMiddleware";

export const createCategoryRouter = (
  categoryController: CategoryController
): Router => {
  const router = Router();
  const adapt = adaptCategoryController(categoryController);

  router.post(
    "/admin/categories",
    authMiddleware("ADMIN"),
    adapt.createCategory
  );
  router.get(
    "/admin/categories",
    protect,
    adapt.getAllCategories
  );
  router.get(
    "/admin/categories/:id",
    protect,
    adapt.getCategoryById
  );
  router.put(
    "/admin/categories/:id",
    authMiddleware("ADMIN"),
    adapt.updateCategory
  );
  router.delete(
    "/admin/categories/:id",
    authMiddleware("ADMIN"),
    adapt.deleteCategory
  );

  return router;
};
