import { api } from "@/api/api";
import {
	Category,
	CategoryFormData,
	ICategoryListOutput,
	IGetAllCategoryResponse,
} from "@/types/category";
import { ApiResponse } from "@/types/general";

export async function createCategory(
	payload: CategoryFormData,
): Promise<Category> {
	try {
		const response = await api.post<Category>("/category", payload);
		return response.data;
	} catch (error: unknown) {
		throw new Error(error instanceof Error ? error.message : "Create category failed");
	}
}

export async function getAllCategories({
	page = 1,
	limit = 10,
	search = "",
	includeDeleted = false,
	sortBy = "createdAt",
	sortOrder = "asc",
	filterBy = "All",
}: {
	page?: number;
	limit?: number;
	search?: string;
	includeDeleted?: boolean;
	sortBy?: string;
	sortOrder?: string;
	filterBy?: string;
} = {}): Promise<ICategoryListOutput> {
	try {
		const response = await api.get<IGetAllCategoryResponse>("/category/", {
			params: {
				page,
				limit,
				search,
				includeDeleted,
				sortBy,
				sortOrder,
				filterBy,
			},
		});
		return {
			categories: response.data.data.categories,
			total: response.data.data.total,
		};
	} catch (error: unknown) {
		throw new Error(
			error instanceof Error ? error.message : "Fetching categories failed",
		);
	}
}
export async function getCategoryById(id: string): Promise<Category> {
	try {
		const response = await api.get<Category>(`/category/${id}`);
		return response.data;
	} catch (error: unknown) {
		throw new Error(
			error instanceof Error ? error.message : "Fetching category failed",
		);
	}
}

export async function updateCategory(
	id: string,
	payload: CategoryFormData,
): Promise<Category> {
	try {
		const response = await api.put<ApiResponse<Category>>(`/category/${id}`, payload);
		return response.data.data as Category;
	} catch (error: unknown) {
		throw new Error(error instanceof Error ? error.message : "Update category failed");
	}
}

export async function deleteCategory(id: string): Promise<Category> {
	try {
		const response = await api.delete<ApiResponse<Category>>(`/category/${id}`);
		return response.data.data as Category;
	} catch (error: unknown) {
		throw new Error(error instanceof Error ? error.message : "Delete category failed");
	}
}

export async function recoverCategory(id: string): Promise<Category> {
	try {
		const response = await api.patch<ApiResponse<Category>>(`/category/${id}/recover`);
		return response.data.data as Category;
	} catch (error: unknown) {
		throw new Error(error instanceof Error ? error.message : "Recover category failed");
	}
}
