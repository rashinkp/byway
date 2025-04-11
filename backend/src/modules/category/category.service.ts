import { CategoryRepository } from "./category.repository";
import { ICategory, ICreateCategoryInput, IGetAllCategoriesInput, IUpdateCategoryInput } from "./types";



export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async createCategory(input: ICreateCategoryInput): Promise<ICategory> {
    const { name } = input;

    const existingCategory = await this.categoryRepository.getCategoryByName(
      name
    );
    if (existingCategory) {
      throw new Error("A category with this name already exists");
    }

    return this.categoryRepository.createCategory(input);
  }

  async getAllCategories(
    input: IGetAllCategoriesInput
  ): Promise<{ categories: ICategory[]; total: number }> {
    return this.categoryRepository.getAllCategories(input);
  }

  async getCategoryById(id: string): Promise<ICategory | null> {
    return this.categoryRepository.getCategoryById(id);
  }

  async updateCategory(input: IUpdateCategoryInput): Promise<ICategory> {
    const { name } = input;
    if (name) {
      const existingCategory = await this.categoryRepository.getCategoryByName(
        name
      );
      if (existingCategory) {
        throw new Error("A category with this name already exists");
      }
    }
    return this.categoryRepository.updateCategory(input);
  }

  async deleteCategory(id: string): Promise<ICategory> {
    return this.categoryRepository.deleteCategory(id);
  }
}