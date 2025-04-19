import { IDatabaseProvider } from "../database";
import { CategoryController } from "../../modules/category/category.controller";
import { CategoryService } from "../../modules/category/category.service";
import { CategoryRepository } from "../../modules/category/category.repository";
import { UserService } from "../../modules/user/user.service";

export interface CategoryDependencies {
  categoryController: CategoryController;
  categoryService: CategoryService
}

export const initializeCategoryDependencies = (
  dbProvider: IDatabaseProvider,
  userService: UserService,
): CategoryDependencies => {
  const prisma = dbProvider.getClient();
  const categoryRepository = new CategoryRepository(prisma);
  const categoryService = new CategoryService(categoryRepository , userService);
  const categoryController = new CategoryController(categoryService);

  return { categoryController, categoryService };
};
