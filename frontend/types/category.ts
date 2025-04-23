export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
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
  data: ICategoryListOutput;
}

export interface IGetAllCategoriesInput {
  page?: number;
  limit?: number;
  sortBy?: "name" | "createdAt" | "updatedAt" | "courses";
  sortOrder?: "asc" | "desc";
  includeDeleted?: boolean;
  search?: string;
  filterBy?: "All" | "Active" | "Inactive";
}
