import { api } from "@/api/api";
import { ApiResponse, IPaginatedResponse } from "@/types/apiResponse";
import { PublicUser, User, UserProfileType } from "@/types/user";
import { IInstructorWithUserDetails } from "@/types/instructor";
import { useAuthStore } from "@/stores/auth.store";

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

export const toggleDeleteUser = async (id: string): Promise<void> => {
	try {
		await api.patch(`/user/softDelete/${id}`);
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message || "Failed to toggle user status",
		);
	}
};

export async function getUserData(): Promise<User> {
	try {
		const response = await api.get(`/user/me`);
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
		return response.data.data; // The backend returns user data directly in data.data
	} catch (error: any) {
		throw new Error(
			error.response?.data?.error || "Failed to update user data",
		);
	}
}

export async function getPublicUser(userId: string): Promise<PublicUser> {
	try {
		const response = await api.get<{ data: PublicUser }>(
			`/user/${userId}/public`,
		);
		return response.data.data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message || "Failed to fetch public user data",
		);
	}
}

export async function getUserAdminDetails(
	userId: string,
): Promise<User & { instructor: IInstructorWithUserDetails | null }> {
	try {
		const response = await api.get(`/user/admin/${userId}`);
		return response.data.data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message || "Failed to fetch user admin details",
		);
	}
}

export async function getDetailedUserData(): Promise<UserProfileType> {
	try {
		const userId = useAuthStore.getState().user?.id;
		if (!userId) {
			console.error("getDetailedUserData: No user ID available");
			throw new Error("User not authenticated");
		}

		console.log("getDetailedUserData: Fetching data for user:", userId);
		const detailedResponse = await api.get<{ data: UserProfileType }>(
			`/user/${userId}`,
		);
		
		console.log("getDetailedUserData: Successfully fetched user data");
		return detailedResponse.data.data;
	} catch (error: any) {
		console.error("getDetailedUserData: Error fetching user data:", error);
		throw new Error(
			error.response?.data?.message ||
				error.response?.data?.error ||
				"Failed to get user data",
		);
	}
}
