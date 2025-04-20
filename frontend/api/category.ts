import { api } from "@/api/api";
import { UseCategoriesProps } from "@/hooks/category/useCategories";
import { Category, CategoryFormData } from "@/types/category";

interface IGetAllCategoryResponse {
  data: { categories: Category[]; total: number };
}

export interface ICategoryListOutput {
  categories: Category[];
  total: number;
}


export async function createCategory(
  payload: CategoryFormData
): Promise<Category> {
  try {
    const response = await api.post<Category>(
      "/category/admin/categories",
      payload
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Create category failed");
  }
}

export async function getAllCategories({
  page = 1,
  limit = 10,
  search = "",
  includeDeleted = false,
  sortBy = "name",
}: UseCategoriesProps): Promise<ICategoryListOutput> {
  try {
    const response = await api.get<IGetAllCategoryResponse>(
      "/category/admin/categories",
      { params: { page, limit, search, includeDeleted, sortBy } }
    );
    return {
      categories: response.data.data.categories,
      total: response.data.data.total,
    };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Fetching categories failed"
    );
  }
}

export async function getCategoryById(id: string): Promise<Category> {
  try {
    const response = await api.get<Category>(
      `/category/admin/categories/${id}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Fetching category failed"
    );
  }
}

export async function updateCategory(
  id: string,
  payload: CategoryFormData
): Promise<Category> {
  try {
    const response = await api.put<Category>(
      `/category/admin/categories/${id}`,
      payload
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Update category failed");
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    await api.delete(`/category/admin/categories/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Delete category failed");
  }
}

export async function recoverCategory(id: string): Promise<Category> {
  try {
    const response = await api.patch<Category>(
      `/category/admin/categories/${id}/recover`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Recover category failed");
  }
}
