import { api } from "@/api/api";
import { ApiError } from "@/types/error";
import {
	ILesson,
	GetAllLessonsParams as GetLessonsParams,
	GetAllLessonsResponse as GetLessonsResponse,
	GetPublicLessonsParams,
	GetPublicLessonsResponse,
} from "@/types/lesson";

export async function getLessons({
	courseId,
	page = 1,
	limit = 10,
	sortBy = "order",
	sortOrder = "asc",
	search = "",
	filterBy = "ALL",
	includeDeleted = false,
}: GetLessonsParams): Promise<GetLessonsResponse> {
	try {
		const response = await api.get<{ data: GetLessonsResponse }>(
			`/lessons/${courseId}/lessons`,
			{
				params: {
					page,
					limit,
					sortBy,
					sortOrder,
					search,
					filterBy,
					includeDeleted,
				},
			},
		);
		return response.data.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(apiError.response?.data?.message || "Failed to fetch lessons");
	}
}

export async function createLesson(data: {
	courseId: string;
	title: string;
	description?: string;
	order: number;
	duration?: number;
}): Promise<ILesson> {
	try {
		const response = await api.post<{ data: ILesson }>("/lessons", data);
		return response.data.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(apiError.response?.data?.message || "Failed to create lesson");
	}
}

// Update a lesson
export async function updateLesson(
	lessonId: string,
	data: {
		title?: string;
		description?: string;
		order?: number;
		thumbnail?: string;
		duration?: number;
	},
): Promise<ILesson> {
	try {
		const response = await api.put<{ data: ILesson }>(
			`/lessons/${lessonId}`,
			data,
		);
		return response.data.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(apiError.response?.data?.message || "Failed to update lesson");
	}
}

export async function deleteLesson(lessonId: string): Promise<ILesson> {
	try {
		const response = await api.delete(`/lessons/${lessonId}`);
		return response.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(
			apiError.response?.data?.message || "Failed to toggle lesson status",
		);
	}
}

export async function getLessonById(lessonId: string): Promise<ILesson> {
	try {
		const response = await api.get<{ data: ILesson }>(`/lessons/${lessonId}`);
		return response.data.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(apiError.response?.data?.message || "Failed to fetch lesson");
	}
}

export async function getPublicLessons({
	courseId,
	page = 1,
	limit = 10,
	sortBy = "order",
	sortOrder = "asc",
	search = "",
}: GetPublicLessonsParams): Promise<GetPublicLessonsResponse> {
	try {
		const response = await api.get<{ data: GetPublicLessonsResponse }>(
			`/lessons/${courseId}/public-lessons`,
			{
				params: {
					page,
					limit,
					sortBy,
					sortOrder,
					search,
				},
			},
		);
		return response.data.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(
			apiError.response?.data?.message || "Failed to fetch public lessons",
		);
	}
}
