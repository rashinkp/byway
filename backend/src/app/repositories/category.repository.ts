import { CategoryRecord } from "../records/category.record";

export interface ICategoryRepository {
  save(category: CategoryRecord): Promise<CategoryRecord>;
  findById(id: string): Promise<CategoryRecord | null>;
  findByName(name: string): Promise<CategoryRecord | null>;
  findAll(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    search?: string;
    includeDeleted?: boolean;
  }): Promise<{ categories: CategoryRecord[]; total: number }>;
}
