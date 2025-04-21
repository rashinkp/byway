import { api } from "@/api/api";
import { ApiResponse, IPaginatedResponse } from "@/types/apiResponse";
import { User } from "@/types/user";

export const getAllUsers = async ({
  page = 1,
  limit = 10,
  sortBy,
  sortOrder,
  includeDeleted,
  search,
  filterBy,
  role,
}: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  includeDeleted?: boolean;
  search?: string;
  filterBy?: string;
  role?: "USER" | "INSTRUCTOR" | "ADMIN";
}): Promise<ApiResponse<IPaginatedResponse<User>>> => {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    if (includeDeleted) params.append("includeDeleted", "true");
    if (search) params.append("search", search);
    if (filterBy) params.append("filterBy", filterBy);
    if (role) params.append("role", role);
    
    const response = await api.get(`/user/admin/users?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export async function deleteUser(id: string): Promise<void> {
  try {
    await api.put(`/user/admin/${id}`, { deletedAt: "true" });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete user"
    );
  }
}

export async function recoverUser(id: string): Promise<User> {
  try {
    const response = await api.put(`/user/admin/${id}`, { deletedAt: "false" });
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to recover user"
    );
  }
} 