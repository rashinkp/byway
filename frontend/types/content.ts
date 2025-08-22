export enum ContentType {
	VIDEO = "VIDEO",
	DOCUMENT = "DOCUMENT",
	QUIZ = "QUIZ",
}

export enum ContentStatus {
	DRAFT = "DRAFT",
	PROCESSING = "PROCESSING",
	PUBLISHED = "PUBLISHED",
	ERROR = "ERROR",
}

export interface QuizQuestion {
	id: string;
	lessonContentId: string;
	question: string;
	options: string[];
	correctAnswer: string;
	createdAt: string;
	updatedAt: string;
}

export interface LessonContent {
	id: string;
	lessonId: string;
	type: ContentType;
	status: ContentStatus;
	title: string | null;
	description: string | null;
	fileUrl: string | null;
	thumbnailUrl: string | null;
	quizQuestions: QuizQuestion[];
	createdAt: string;
	updatedAt: string;
	deletedAt?: string | null;
}

export interface CreateLessonContentInput {
	lessonId: string;
	type: ContentType;
	status?: ContentStatus;
	title: string;
	description?: string | null;
	fileUrl?: string | null;
	thumbnailUrl?: string | null;
	quizQuestions?: {
		question: string;
		options: string[];
		correctAnswer: string;
	}[];
}

export interface UpdateLessonContentInput {
	id: string;
	lessonId: string;
	type?: ContentType;
	status?: ContentStatus;
	title?: string;
	description?: string | null;
	fileUrl?: string | null;
	thumbnailUrl?: string | null;
	quizQuestions?: {
		question: string;
		options: string[];
		correctAnswer: string;
	}[];
}
