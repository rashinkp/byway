import { CategoryRecord } from "../records/category.record";

export interface ICategoryRepository {
  save(category: CategoryRecord): Promise<CategoryRecord>;
  findById(id: string): Promise<CategoryRecord | null>;
  findByName(name: string): Promise<CategoryRecord | null>;
  findAll(options: {
    page?: number;
    limit?: number;
    search?: string;
    includeDeleted?: boolean;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    filterBy?: string;
  }): Promise<{ categories: CategoryRecord[]; total: number }>;
}
