export interface Category {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface CategoryFormData {
  name: string;
  description?: string;
}

export interface ICategoryListOutput {
  categories: Category[];
  total: number;
}


export interface IGetAllCategoryResponse {
  data: { categories: Category[]; total: number };
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