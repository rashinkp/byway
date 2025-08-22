import { api } from "@/api/api";
import { ApiError } from "@/types/error";
import {
	Course,
	AddCourseParams,
	CourseEditFormData,
	IGetEnrolledCoursesInput,
	IUpdateCourseApprovalInput,
	CourseApiResponse,
} from "@/types/course";
import { CourseStats } from "@/types/dashboard";

export async function getAllCourses({
	page = 1,
	limit = 10,
	search = "",
	sortBy = "title",
	sortOrder = "asc",
	includeDeleted = false,
	filterBy = "All",
	userId,
	myCourses = false,
	role,
	level = "All",
	duration = "All",
	price = "All",
	categoryId,
}: {
	page?: number;
	limit?: number;
	search?: string;
	sortBy?: "title" | "price" | "createdAt";
	sortOrder?: "asc" | "desc";
	includeDeleted?: boolean;
	filterBy?: string;
	userId?: string;
	myCourses?: boolean;
	role?: "USER" | "INSTRUCTOR" | "ADMIN";
	level?: "All" | "BEGINNER" | "MEDIUM" | "ADVANCED";
	duration?: "All" | "Under5" | "5to10" | "Over10";
	price?: "All" | "Free" | "Paid";
	categoryId?: string;
}): Promise<CourseApiResponse> {
	try {
		const response = await api.get<{ data: CourseApiResponse }>("/courses", {
			params: {
				page,
				limit,
				search,
				sortBy,
				sortOrder,
				includeDeleted,
				filterBy,
				userId,
				myCourses,
				role,
				level,
				duration,
				price,
				categoryId,
			},
		});
		return response.data.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(apiError.response?.data?.message || "Failed to fetch courses");
	}
}

export async function createCourse(
	courseData: AddCourseParams,
): Promise<Course> {
	try {
		const response = await api.post<{ data: Course }>("/courses/", courseData);
		return response.data.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(apiError.response?.data?.message || "Failed to create course");
	}
}

export async function deleteCourse(id: string): Promise<void> {
	try {
		await api.delete(`/courses/${id}`);
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(apiError.response?.data?.message || "Failed to delete course");
	}
}

export async function getCourseById(id: string): Promise<Course> {
	try {
		const result = await api.get(`/courses/${id}`);
		return result.data.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(apiError.response?.data?.message || "Failed to fetch course");
	}
}

export async function updateCourse(
	id: string,
	courseData: CourseEditFormData,
): Promise<Course> {
	try {
		const response = await api.put(`/courses/${id}`, courseData);
		return response.data.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const errorMessage =
			apiError.response?.data?.message || "Failed to update course";
		throw new Error(errorMessage);
	}
}

export async function getEnrolledCourses({
	page = 1,
	limit = 10,
	sortBy = "enrolledAt",
	sortOrder = "desc",
	search = "",
	level = "All",
}: IGetEnrolledCoursesInput): Promise<CourseApiResponse> {
	try {
		const response = await api.get<{ data: CourseApiResponse }>(
			"/courses/enrolled",
			{
				params: {
					page,
					limit,
					sortBy,
					sortOrder,
					search,
					level,
				},
			},
		);
		return response.data.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(
			apiError.response?.data?.message || "Failed to fetch enrolled courses",
		);
	}
}

export async function approveCourse({
	courseId,
}: IUpdateCourseApprovalInput): Promise<Course> {
	try {
		const response = await api.post<{ data: Course }>("/courses/approve", {
			courseId,
		});
		return response.data.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(
			apiError.response?.data?.message || "Failed to approve course",
		);
	}
}

export async function declineCourse({
	courseId,
}: IUpdateCourseApprovalInput): Promise<Course> {
	try {
		const response = await api.post<{ data: Course }>("/courses/decline", {
			courseId,
		});
		return response.data.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(
			apiError.response?.data?.message || "Failed to decline course",
		);
	}
}

export async function getCourseStats(): Promise<CourseStats> {
	try {
		const response = await api.get<{ data: CourseStats }>("/courses/stats");
		return response.data.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(
			apiError.response?.data?.message || "Failed to fetch course stats",
		);
	}
}
