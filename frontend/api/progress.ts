import { api } from "./api";
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
	} catch (error: any) {
		console.error("Update progress error:", {
			status: error.response?.status,
			data: error.response?.data,
			message: error.message,
		});
		throw new Error(
			error.response?.data?.message ||
				error.response?.data?.error ||
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
	} catch (error: any) {
		console.error("Get progress error:", {
			status: error.response?.status,
			data: error.response?.data,
			message: error.message,
		});
		throw new Error(
			error.response?.data?.message ||
				error.response?.data?.error ||
				"Failed to get progress",
		);
	}
}
