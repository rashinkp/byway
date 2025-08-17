import { LessonContent } from "./content";

export enum LessonStatus {
	DRAFT = "DRAFT",
	PUBLISHED = "PUBLISHED",
}

export interface ILesson {
	id: string;
	courseId: string;
	title: string;
	description?: string | null;
	order: number;
	status: LessonStatus;
	content?: LessonContent | null;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string | null;
}

// Alias for backward compatibility
export type Lesson = ILesson;

export interface GetAllLessonsParams {
	courseId: string;
	page?: number;
	limit?: number;
	sortBy?: "order" | "title" | "createdAt" | "updatedAt";
	sortOrder?: "asc" | "desc";
	search?: string;
	filterBy?: "DRAFT" | "PUBLISHED" | "ALL" | "INACTIVE";
	includeDeleted?: boolean;
}

export interface GetAllLessonsResponse {
	lessons: ILesson[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
	[key: string]: unknown;
}

// Aliases for backward compatibility
export type GetLessonsParams = GetAllLessonsParams;
export type GetLessonsResponse = GetAllLessonsResponse;

export interface ICreateLessonInput {
	courseId: string;
	title: string;
	description?: string | null;
	order: number;
}

export interface UpdateLessonInput {
	lessonId: string;
	title?: string;
	description?: string;
	order?: number;
	status?: LessonStatus;
}

export interface GetPublicLessonsParams {
	courseId: string;
	page?: number;
	limit?: number;
	sortBy?: "order" | "title" | "createdAt" | "updatedAt";
	sortOrder?: "asc" | "desc";
	search?: string;
}

export interface PublicLesson {
	id: string;
	title: string;
	description?: string | null;
	order: number;
}

export interface GetPublicLessonsResponse {
	lessons: PublicLesson[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}
