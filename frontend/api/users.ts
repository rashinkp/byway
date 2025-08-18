import { api } from "@/api/api";
import { ApiResponse } from "@/types/general";
import { ApiError } from "@/types/error";
import { User, PublicUser, UserProfileType } from "@/types/user";
import { IInstructorWithUserDetails } from "@/types/instructor";
import { useAuthStore } from "@/stores/auth.store";
import { IPaginatedResponse } from "@/types/general";

export const getAllUsers = async ({
	page = 1,
	limit = 10,
	search = "",
	sortBy = "createdAt",
	sortOrder = "desc",
	filterBy = "All",
	role,
}: {
	page?: number;
	limit?: number;
	search?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	filterBy?: string;
	role?: string;
}): Promise<ApiResponse<IPaginatedResponse<User>>> => {
	try {
		const params = new URLSearchParams();
		params.append("page", page.toString());
		params.append("limit", limit.toString());
		params.append("search", search);
		params.append("sortBy", sortBy);
		params.append("sortOrder", sortOrder);
		if (filterBy) params.append("filterBy", filterBy);
		if (role) params.append("role", role);

		const response = await api.get(`/user/admin/users?${params.toString()}`);
		// Transform the response to include page and limit
		const responseData = response.data.data;
		return {
			...response.data,
			data: {
				...responseData,
				page,
				limit
			}
		};
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(apiError.response?.data?.message || "Failed to fetch users");
	}
};

export const toggleDeleteUser = async (id: string): Promise<void> => {
	try {
		await api.patch(`/user/softDelete/${id}`);
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(
			apiError.response?.data?.message || "Failed to toggle user status",
		);
	}
};

export async function getUserData(): Promise<User> {
	try {
		const response = await api.get(`/user/me`);
		return response.data.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(apiError.response?.data?.error || "Failed to get user data");
	}
}

export async function getUserDataById(userId: string): Promise<User> {
	try {
		const response = await api.get(`/user/users/${userId}`);
		return response.data.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(apiError.response?.data?.error || "Failed to get user data");
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
		return response.data.data; // The backend returns user data directly in data.data
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(
			apiError.response?.data?.error || "Failed to update user data",
		);
	}
}

export async function getPublicUser(userId: string): Promise<PublicUser> {
	try {
		const response = await api.get<{ data: PublicUser }>(
			`/user/${userId}/public`,
		);
		return response.data.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(
			apiError.response?.data?.message || "Failed to fetch public user data",
		);
	}
}

export async function getUserAdminDetails(
	userId: string,
): Promise<User & { instructor: IInstructorWithUserDetails | null }> {
	try {
		const response = await api.get(`/user/admin/${userId}`);
		return response.data.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(
			apiError.response?.data?.message || "Failed to fetch user admin details",
		);
	}
}

export async function getDetailedUserData(): Promise<UserProfileType> {
	try {
		const userId = useAuthStore.getState().user?.id;
		if (!userId) {
			throw new Error("User not authenticated");
		}

		const detailedResponse = await api.get<{ data: UserProfileType }>(
			`/user/${userId}`,
		);
		
		return detailedResponse.data.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(
			apiError.response?.data?.message ||
				apiError.response?.data?.error ||
				"Failed to get user data",
		);
	}
}
