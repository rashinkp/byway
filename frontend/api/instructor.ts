import { api } from "@/api/api";
import { ApiResponse } from "@/types/general";
import { ApiError } from "@/types/error";
import { IInstructorWithUserDetails, IInstructorDetails, InstructorProfile, InstructorCourse } from "@/types/instructor";

interface InstructorCreationResponse {
	id: string;
	userId: string;
	areaOfExpertise: string;
	professionalExperience: string;
	about?: string;
	website?: string;
	education: string;
	certifications: string;
	cv: string;
	status: string;
	totalStudents: number;
	createdAt: string | Date;
	updatedAt: string | Date;
	user: {
		id: string;
		name: string;
		email: string;
		role: "USER" | "INSTRUCTOR" | "ADMIN";
		avatar?: string;
	};
}

export const createInstructor = async (data: {
	areaOfExpertise: string;
	professionalExperience: string;
	about?: string;
	website?: string;
	education: string;
	certifications?: string;
	cv: string;
}): Promise<ApiResponse<InstructorCreationResponse>> => {
	try {
		const response = await api.post<ApiResponse<InstructorCreationResponse>>(
			"/instructor/create",
			data,
		);
		return response.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;

		if (apiError.response) {
			const { status, data } = apiError.response;

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
		} else {
			// Other errors (network errors, etc.)
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
		throw new Error(
			apiError.response?.data?.message || "Failed to fetch instructors",
		);
	}
};

export const getInstructorDetails = async (
	userId: string,
): Promise<ApiResponse<IInstructorDetails>> => {
	try {
		const response = await api.get<ApiResponse<IInstructorDetails>>(
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

export const getInstructorProfile = async (userId: string): Promise<InstructorProfile> => {
  const response = await api.get<InstructorProfile>(`/instructors/${userId}`);
  return response.data;
};

export const updateInstructorProfile = async (
  userId: string,
  data: Partial<InstructorProfile>
): Promise<InstructorProfile> => {
  const response = await api.patch<InstructorProfile>(
    `/instructors/${userId}`,
    data
  );
  return response.data;
};

export const getInstructorCourses = async (): Promise<InstructorCourse[]> => {
  const response = await api.get<InstructorCourse[]>("/instructors/courses");
  return response.data;
};
