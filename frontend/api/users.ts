import { api } from "@/api/api";
import { ApiResponse, IPaginatedResponse } from "@/types/apiResponse";
import { PublicUser, User } from "@/types/user";

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
    return response.data; // Adjusted to return the full ApiResponse
  } catch (error: any) {
    console.error("Error fetching users:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export async function deleteUser(id: string): Promise<void> {
  try {
    await api.put(`/user/admin/${id}`, { deletedAt: "true" });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
}

export async function recoverUser(id: string): Promise<void> {
  try {
    await api.put(`/user/admin/${id}`, { deletedAt: "false" });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to recover user");
  }
}

export async function getUserData(): Promise<User> {
  try {
    const response = await api.get(`/user/users/me`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to get user data");
  }
}

export async function getUserDataById(userId: string): Promise<User> {
  try {
    const response = await api.get(`/user/users/${userId}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Failed to get user data");
  }
}


export async function updateUser(data: {
  name?: string;
  avatar?: string;
  bio?: string;
  education?: string;
  skills?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
}): Promise<User> {
  try {
    const response = await api.put(`/user/users`, data);
    return response.data.data.user; // Extract the user object from IUserWithProfile
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Failed to update user data"
    );
  }
}


 export async function getPublicUser(userId: string): Promise<PublicUser> {
   try {
     const response = await api.get<{ data: PublicUser }>(
       `/user/users/${userId}/public`
     );
     return response.data.data;
   } catch (error: any) {
     throw new Error(
       error.response?.data?.message || "Failed to fetch public user data"
     );
   }
 }