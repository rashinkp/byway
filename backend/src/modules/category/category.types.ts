export interface ICategory {
  id: string;
  name: string;
  description?: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface ICreateCategoryInput {
  name: string;
  description?: string | null;
  createdBy: string;
}

export interface IUpdateCategoryInput {
  id: string;
  name?: string;
  description?: string | null;
}

export interface IRecoverCategoryInput {
  id: string;
}

export interface IGetAllCategoriesInput {
  page?: number;
  limit?: number;
  sortBy?: "name" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  includeDeleted?: boolean;
  search?: string;
  filterBy?: "All" | "Active" | "Inactive";
}

export interface ICategoryRepository {
  createCategory(input: ICreateCategoryInput): Promise<ICategory>;
  getAllCategories(
    input: IGetAllCategoriesInput
  ): Promise<{ categories: ICategory[]; total: number }>;
  getCategoryById(id: string): Promise<ICategory | null>;
  updateCategory(input: IUpdateCategoryInput): Promise<ICategory>;
  deleteCategory(id: string): Promise<ICategory>;
  getCategoryByName(name: string): Promise<ICategory | null>;
  recoverCategory(id: string): Promise<ICategory>;
}
