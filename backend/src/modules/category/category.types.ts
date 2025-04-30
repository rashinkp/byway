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

