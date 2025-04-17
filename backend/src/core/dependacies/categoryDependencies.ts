import { IDatabaseProvider } from "../database";
import { CategoryController } from "../../modules/category/category.controller";
import { CategoryService } from "../../modules/category/category.service";
import { CategoryRepository } from "../../modules/category/category.repository";

export interface CategoryDependencies {
  categoryController: CategoryController;
  categoryRepository: CategoryRepository; // Exported for use in course
}

export const initializeCategoryDependencies = (
  dbProvider: IDatabaseProvider
): CategoryDependencies => {
  const prisma = dbProvider.getClient();
  const categoryRepository = new CategoryRepository(prisma);
  const categoryService = new CategoryService(categoryRepository);
  const categoryController = new CategoryController(categoryService);

  return { categoryController, categoryRepository };
};
