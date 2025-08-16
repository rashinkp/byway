import { api } from "@/api/api";
import { ApiResponse } from "@/types/general";
import { ApiError } from "@/types/error";
import { User } from "@/types/user";
import { IInstructorWithUserDetails } from "@/types/instructor";

export const createInstructor = async (data: {
	areaOfExpertise: string;
	professionalExperience: string;
	about: string;
	website?: string;
	education: string;
	certifications: string;
	cv: string;
}): Promise<ApiResponse<User>> => {
	try {
		const response = await api.post<ApiResponse<User>>(
			"/instructor/create",
			data,
		);
		return response.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		console.error("API Error in createInstructor:", apiError);

		// Handle different error scenarios
		if (apiError.response) {
			// Server responded with error status
			const { status, data } = apiError.response;

			// Handle specific status codes
			if (status === 404) {
				throw {
					response: {
						status: 404,
						data: {
							message: "User not found. Please try logging in again.",
							statusCode: 404,
							success: false,
							data: null,
						},
					},
					message: "User not found. Please try logging in again.",
				};
			}

			if (status === 400) {
				throw {
					response: {
						status: 400,
						data: data || {
							message: "Invalid application data",
							statusCode: 400,
							success: false,
							data: null,
						},
					},
					message: data?.message || "Invalid application data",
				};
			}

			if (status === 403) {
				throw {
					response: {
						status: 403,
						data: data || {
							message: "You are not authorized to perform this action",
							statusCode: 403,
							success: false,
							data: null,
						},
					},
					message:
						data?.message || "You are not authorized to perform this action",
				};
			}

			// For other status codes, preserve the original error structure
			throw {
				response: {
					status: status,
					data: data,
				},
				message: data?.message || `Request failed with status ${status}`,
			};
		} else if (apiError.request) {
			// Network error
			throw {
				response: undefined,
				message: "Network error. Please check your connection and try again.",
			};
		} else {
			// Other errors
			throw {
				response: undefined,
				message: apiError.message || "Failed to create instructor",
			};
		}
	}
};

export const approveInstructor = async (
	instructorId: string,
): Promise<ApiResponse<{ id: string; status: string }>> => {
	try {
		const response = await api.post<
			ApiResponse<{ id: string; status: string }>
		>("/instructor/approve", { instructorId });
		return response.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		console.error("Error approving instructor:", apiError);
		throw new Error(
			apiError.response?.data?.message || "Failed to approve instructor",
		);
	}
};

export const declineInstructor = async (
	instructorId: string,
): Promise<ApiResponse<{ id: string; status: string }>> => {
	try {
		const response = await api.post<
			ApiResponse<{ id: string; status: string }>
		>("/instructor/decline", { instructorId });
		return response.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		console.error("Error declining instructor:", apiError);
		throw new Error(
			apiError.response?.data?.message || "Failed to decline instructor",
		);
	}
};

export const getAllInstructors = async (params?: {
	page?: number;
	limit?: number;
	search?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	filterBy?: "All" | "Pending" | "Approved" | "Declined";
	includeDeleted?: boolean;
}): Promise<
	ApiResponse<{
		items: IInstructorWithUserDetails[];
		total: number;
		totalPages: number;
	}>
> => {
	try {
		const queryParams = new URLSearchParams();
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined) {
					// Convert boolean to string for URL params
					if (typeof value === "boolean") {
						queryParams.append(key, value.toString());
					} else {
						queryParams.append(key, value.toString());
					}
				}
			});
		}
		console.log("[Instructor API] Making request to:", `/instructor/instructors?${queryParams.toString()}`);
		console.log("[Instructor API] API base URL:", process.env.NEXT_PUBLIC_API_URL);
		const response = await api.get<
			ApiResponse<{
				items: IInstructorWithUserDetails[];
				total: number;
				totalPages: number;
			}>
		>(`/instructor/instructors?${queryParams.toString()}`);
		return response.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		console.error("Error fetching instructors:", apiError);
		throw new Error(
			apiError.response?.data?.message || "Failed to fetch instructors",
		);
	}
};

export const getInstructorByUserId = async (): Promise<
	ApiResponse<IInstructorWithUserDetails | null>
> => {
	try {
		const response =
			await api.get<ApiResponse<IInstructorWithUserDetails | null>>(
				"/instructor/me",
			);
		return response.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		console.error("Error fetching instructor by user ID:", apiError);

		// Handle 404 errors gracefully - user might not have an instructor record yet
		if (apiError.response?.status === 404) {
			// Return null instead of throwing error for 404
			return {
				success: true,
				message: "No instructor record found",
				data: null,
				statusCode: 200,
			};
		}

		// For other errors, throw as usual
		throw new Error(
			apiError.response?.data?.message || "Failed to fetch instructor",
		);
	}
};

export const getPublicInstructors = async (params?: {
	page?: number;
	limit?: number;
	search?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}): Promise<
	ApiResponse<{
		items: IInstructorWithUserDetails[];
		total: number;
		totalPages: number;
	}>
> => {
	try {
		const queryParams = new URLSearchParams();
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined) {
					queryParams.append(key, value.toString());
				}
			});
		}
		const response = await api.get<
			ApiResponse<{
				items: IInstructorWithUserDetails[];
				total: number;
				totalPages: number;
			}>
		>(`/instructor/public/instructors?${queryParams.toString()}`);
		return response.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		console.error("Error fetching public instructors:", apiError);
		throw new Error(
			apiError.response?.data?.message || "Failed to fetch instructors",
		);
	}
};

export const getInstructorDetails = async (
	userId: string,
): Promise<ApiResponse<any>> => { // Changed from IInstructorDetails to any as IInstructorDetails is not defined
	try {
		const response = await api.get<ApiResponse<any>>(
			`/instructor/${userId}`,
		);
		return response.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw {
			response: apiError.response
				? {
						status: apiError.response.status,
						data: apiError.response.data,
					}
				: undefined,
			message:
				apiError.response?.data?.message || "Failed to get instructor details",
		};
	}
};





export const getInstructorProfile = async (userId: string) => {
  const response = await api.get<any>(`/instructors/${userId}`); // Changed from InstructorProfile to any
  return response.data;
};

export const updateInstructorProfile = async (
  userId: string,
  data: Partial<any> // Changed from InstructorProfile to any
) => {
  const response = await api.patch<any>(
    `/instructors/${userId}`,
    data
  );
  return response.data;
};

export const getInstructorCourses = async () => {
  const response = await api.get<any[]>("/instructors/courses"); // Changed from InstructorCourse[] to any[]
  return response.data;
};
