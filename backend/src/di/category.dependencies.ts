import { PrismaClient } from "@prisma/client";
import { CategoryController } from "../presentation/http/controllers/category.controller";
import { CategoryRepository } from "../app/repositories/category.repository.impl";
import { UserRepository } from "../app/repositories/user.repository.impl";
import { GetAllCategoriesUseCase } from "../app/usecases/category/implementations/get-all-category.usecase";
import { GetCategoryByIdUseCase } from "../app/usecases/category/implementations/get-category-by-Id.usecase";
import { RecoverCategoryUseCase } from "../app/usecases/category/implementations/recover-category.usecase";
import { CreateCategoryUseCase } from "../app/usecases/category/implementations/create-category.usecase";
import { UpdateCategoryUseCase } from "../app/usecases/category/implementations/update-category.usecase";
import { DeleteCategoryUseCase } from "../app/usecases/category/implementations/delete-category.usecase";

export interface CategoryDependencies {
  categoryController: CategoryController;
}

export function createCategoryDependencies(): CategoryDependencies {
  // Initialize infrastructure
  const prisma = new PrismaClient();
  const categoryRepository = new CategoryRepository(prisma);
  const userRepository = new UserRepository(prisma);

  // Initialize use cases
  const createCategoryUseCase = new CreateCategoryUseCase(
    categoryRepository,
    userRepository
  );
  const getAllCategoriesUseCase = new GetAllCategoriesUseCase(
    categoryRepository
  );
  const getCategoryByIdUseCase = new GetCategoryByIdUseCase(categoryRepository);
  const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
  const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);
  const recoverCategoryUseCase = new RecoverCategoryUseCase(categoryRepository);

  // Initialize controller
  const categoryController = new CategoryController(
    createCategoryUseCase,
    getAllCategoriesUseCase,
    getCategoryByIdUseCase,
    updateCategoryUseCase,
    deleteCategoryUseCase,
    recoverCategoryUseCase
  );

  return {
    categoryController,
  };
}
