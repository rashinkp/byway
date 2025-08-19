
import { Category } from "../../domain/entities/category.entity";
import { PaginationFilter } from "../../domain/types/pagination-filter.interface";
import { IGenericRepository } from "./base/generic-repository.interface";

export interface ICategoryRepository extends IGenericRepository<Category> {
  save(category: Category): Promise<Category>;
  findByName(name: string): Promise<Category | null>;
  findAll(
    input: PaginationFilter
  ): Promise<{ categories: Category[]; total: number }>;
}
