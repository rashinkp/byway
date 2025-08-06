import { IGetAllCategoriesInputDTO } from "../dtos/category.dto";
import { Category } from "../../domain/entities/category.entity";

export interface ICategoryRepository {
  save(category: Category): Promise<Category>;
  findById(id: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  findAll(
    input: IGetAllCategoriesInputDTO
  ): Promise<{ categories: Category[]; total: number }>;
}
