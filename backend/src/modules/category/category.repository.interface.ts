import { ICategory, ICreateCategoryInput, IGetAllCategoriesInput, IUpdateCategoryInput } from "./category.types";

export interface ICategoryRepository {
  createCategory(input: ICreateCategoryInput): Promise<ICategory>;
  getAllCategories(
    input: IGetAllCategoriesInput
  ): Promise<{ categories: ICategory[]; total: number }>;
  getCategoryById(categoryId: string): Promise<ICategory | null>;
  updateCategory(input: IUpdateCategoryInput): Promise<ICategory>;
  deleteCategory(categoryId: string): Promise<ICategory>;
  getCategoryByName(name: string): Promise<ICategory | null>;
  recoverCategory(categoryId: string): Promise<ICategory>;
}
