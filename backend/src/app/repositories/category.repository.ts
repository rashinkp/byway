
import { Category } from "../../domain/entities/category.entity";
import { PaginationFilter } from "../../domain/types/pagination-filter.interface";

export interface ICategoryRepository {
  save(category: Category): Promise<Category>;
  findById(id: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  findAll(
    input: PaginationFilter
  ): Promise<{ categories: Category[]; total: number }>;
}
