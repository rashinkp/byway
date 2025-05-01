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

export type SortByField = "name" | "createdAt" | "updatedAt" | "courses";
export type NegativeSortByField = `-${SortByField}`;

export interface IGetAllCategoriesInput {
  page?: number;
  limit?: number;
  search?: string;
  includeDeleted?: boolean;
  sortOrder?: "asc" | "desc";
  sortBy?: SortByField | NegativeSortByField | undefined;
  filterBy?: "All" | "Active" | "Inactive";
}
