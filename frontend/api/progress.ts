import { api } from "./api";
import { ApiError } from "@/types/error";
import {
	IProgress,
	IProgressResponse,
	IUpdateProgressInput,
	IGetProgressInput,
} from "@/types/progress";

export async function updateProgress(
	data: IUpdateProgressInput,
): Promise<IProgress> {
	try {
		const response = await api.patch<IProgressResponse>(
			`/progress/${data.courseId}/progress`,
			{
				lessonId: data.lessonId,
				completed: data.completed,
				quizAnswers: data.quizAnswers,
				score: data.score,
				totalQuestions: data.totalQuestions,
			},
		);
		return response.data.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		console.error("Update progress error:", {
			status: apiError.response?.status,
			data: apiError.response?.data,
			message: apiError.message,
		});
		throw new Error(
			apiError.response?.data?.message ||
				apiError.response?.data?.error ||
				"Failed to update progress",
		);
	}
}

export async function getProgress({
	courseId,
}: IGetProgressInput): Promise<IProgress> {
	try {
		const response = await api.get<IProgressResponse>(
			`/progress/${courseId}/progress`,
		);
		return response.data.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		console.error("Get progress error:", {
			status: apiError.response?.status,
			data: apiError.response?.data,
			message: apiError.message,
		});
		throw new Error(
			apiError.response?.data?.message ||
				apiError.response?.data?.error ||
				"Failed to get progress",
		);
	}
}
