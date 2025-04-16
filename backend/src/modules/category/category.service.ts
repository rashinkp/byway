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
    const { id, name } = input;
    if (!id) throw new Error("Category ID is required");
    if (name) {
      const existingCategory = await this.categoryRepository.getCategoryByName(
        name
      );
      if (existingCategory && existingCategory.id !== id) {
        throw new Error("A category with this name already exists");
      }
    }
    return this.categoryRepository.updateCategory(input);
  }

  async deleteCategory(id: string): Promise<ICategory> {
    let category = await this.categoryRepository.getCategoryById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    console.log(category);

    if (category.deletedAt) {
      console.log("reaching here recoer");
      category = await this.categoryRepository.recoverCategory(id);
    } else {
      console.log("reaching here delete");
      category = await this.categoryRepository.deleteCategory(id);
    }
    return category;
  }
}