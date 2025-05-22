import { CategoryController } from "../presentation/http/controllers/category.controller";
import { GetAllCategoriesUseCase } from "../app/usecases/category/implementations/get-all-category.usecase";
import { GetCategoryByIdUseCase } from "../app/usecases/category/implementations/get-category-by-Id.usecase";
import { RecoverCategoryUseCase } from "../app/usecases/category/implementations/recover-category.usecase";
import { CreateCategoryUseCase } from "../app/usecases/category/implementations/create-category.usecase";
import { UpdateCategoryUseCase } from "../app/usecases/category/implementations/update-category.usecase";
import { DeleteCategoryUseCase } from "../app/usecases/category/implementations/delete-category.usecase";
import { SharedDependencies } from "./shared.dependencies";

export interface CategoryDependencies {
  categoryController: CategoryController;
}

export function createCategoryDependencies(
  deps: SharedDependencies
): CategoryDependencies {
  const { categoryRepository, userRepository } = deps;

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
    updateCategoryUseCase,
    getCategoryByIdUseCase,
    getAllCategoriesUseCase,
    deleteCategoryUseCase,
    recoverCategoryUseCase,
    deps.httpErrors,
    deps.httpSuccess
  );

  return {
    categoryController,
  };
}
