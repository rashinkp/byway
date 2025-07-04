import { api } from "./api";
import {
	CourseReview,
	CreateCourseReviewParams,
	UpdateCourseReviewParams,
	CourseReviewApiResponse,
	CourseReviewStats,
	DisableReviewResponse,
	QueryCourseReviewParams,
	GetUserReviewsResponse,
} from "@/types/course-review";

export async function createCourseReview(
	reviewData: CreateCourseReviewParams,
): Promise<CourseReview> {
	try {
		const response = await api.post<{ data: CourseReview }>(
			"/reviews/",
			reviewData,
		);
		return response.data.data;
	} catch (error: any) {
		console.error("Failed to create review:", error);
		throw new Error(error.response?.data?.message || "Failed to create review");
	}
}

export async function updateCourseReview(
	id: string,
	reviewData: UpdateCourseReviewParams,
): Promise<CourseReview> {
	try {
		const response = await api.put<{ data: CourseReview }>(
			`/reviews/${id}`,
			reviewData,
		);
		return response.data.data;
	} catch (error: any) {
		console.error("Failed to update review:", error);
		throw new Error(error.response?.data?.message || "Failed to update review");
	}
}

export async function deleteCourseReview(id: string): Promise<void> {
	try {
		await api.delete(`/reviews/${id}`);
	} catch (error: any) {
		console.error("Failed to delete review:", error);
		throw new Error(error.response?.data?.message || "Failed to delete review");
	}
}

export async function getCourseReviews(
	courseId: string,
	params: QueryCourseReviewParams = {} as QueryCourseReviewParams,
): Promise<CourseReviewApiResponse> {
	try {
		const queryParams: any = {
			page: params.page || 1,
			limit: params.limit || 10,
			rating: params.rating,
			sortBy: params.sortBy || "createdAt",
			sortOrder: params.sortOrder || "desc",
		};
		if (params.isMyReviews === true) {
			queryParams.isMyReviews = true;
		}
		if (params.includeDisabled === true) {
			queryParams.includeDisabled = true;
		}
		const response = await api.get<{ data: CourseReviewApiResponse }>(
			`/reviews/course/${courseId}`,
			{
				params: queryParams,
			},
		);
		return response.data.data;
	} catch (error: any) {
		console.error("Failed to fetch course reviews:", error);
		throw new Error(
			error.response?.data?.message || "Failed to fetch course reviews",
		);
	}
}

export async function getCourseReviewStats(
	courseId: string,
): Promise<CourseReviewStats> {
	try {
		const response = await api.get<{ data: CourseReviewStats }>(
			`/reviews/course/${courseId}/stats`,
		);
		return response.data.data;
	} catch (error: any) {
		console.error("Failed to fetch course review stats:", error);
		throw new Error(
			error.response?.data?.message || "Failed to fetch course review stats",
		);
	}
}

export async function getUserReviews(
	params: { page?: number; limit?: number } = {} as {
		page?: number;
		limit?: number;
	},
): Promise<GetUserReviewsResponse> {
	try {
		const response = await api.get<{ data: GetUserReviewsResponse }>(
			"/reviews/my-reviews",
			{
				params: {
					page: params.page || 1,
					limit: params.limit || 10,
				},
			},
		);
		return response.data.data;
	} catch (error: any) {
		console.error("Failed to fetch user reviews:", error);
		throw new Error(
			error.response?.data?.message || "Failed to fetch user reviews",
		);
	}
}

export async function disableReview(
	id: string,
): Promise<DisableReviewResponse> {
	try {
		const response = await api.patch<{ data: DisableReviewResponse }>(
			`/reviews/${id}/disable`,
		);
		return response.data.data;
	} catch (error: any) {
		console.error("Failed to disable review:", error);
		throw new Error(
			error.response?.data?.message || "Failed to disable review",
		);
	}
}
