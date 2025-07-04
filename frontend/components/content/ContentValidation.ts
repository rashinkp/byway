import { ContentType } from "@/types/content";

export const validateForm = (
	type: ContentType,
	title: string,
	file: File | null,
	fileUrl: string,
	thumbnail: File | null,
	thumbnailUrl: string,
	questions: { question: string; options: string[]; correctAnswer: string }[],
	setErrors: (errors: {
		title?: string;
		file?: string;
		thumbnail?: string;
		questions?: string;
	}) => void,
): boolean => {
	const newErrors: {
		title?: string;
		file?: string;
		thumbnail?: string;
		questions?: string;
	} = {};
	if (!title) newErrors.title = "Title is required";
	if (
		(type === ContentType.VIDEO || type === ContentType.DOCUMENT) &&
		!file &&
		!fileUrl
	) {
		newErrors.file = "Please select a file or provide a URL";
	}
	if (type === ContentType.VIDEO && file) {
		const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
		if (!validVideoTypes.includes(file.type)) {
			newErrors.file = "Please select a valid video file (MP4, WebM, or OGG)";
		}
		if (file.size > 50 * 1024 * 1024) {
			newErrors.file = "Video file size must be less than 50MB";
		}
	}
	if (type === ContentType.VIDEO && !thumbnail && !thumbnailUrl) {
		newErrors.thumbnail = "Please select a thumbnail or provide a URL";
	}
	if (type === ContentType.VIDEO && thumbnail) {
		const validImageTypes = ["image/jpeg", "image/png", "image/webp"];
		if (!validImageTypes.includes(thumbnail.type)) {
			newErrors.thumbnail =
				"Please select a valid image file (JPEG, PNG, or WebP)";
		}
		if (thumbnail.size > 5 * 1024 * 1024) {
			newErrors.thumbnail = "Thumbnail file size must be less than 5MB";
		}
	}
	if (type === ContentType.DOCUMENT && file) {
		const validDocumentTypes = [
			"application/pdf",
			"application/msword",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		];
		if (!validDocumentTypes.includes(file.type)) {
			newErrors.file =
				"Please select a valid document file (PDF, DOC, or DOCX)";
		}
		if (file.size > 50 * 1024 * 1024) {
			newErrors.file = "Document file size must be less than 50MB";
		}
	}
	if (type === ContentType.QUIZ && questions.length === 0) {
		newErrors.questions = "At least one question is required for Quiz";
	}
	setErrors(newErrors);
	return Object.keys(newErrors).length === 0;
};

export const validateQuestion = (
	newQuestion: string,
	newOptions: string[],
	newAnswer: string,
	setErrors: (errors: {
		newQuestion?: string;
		newOptions?: string;
		newAnswer?: string;
	}) => void,
): boolean => {
	const newErrors: {
		newQuestion?: string;
		newOptions?: string;
		newAnswer?: string;
	} = {};
	if (!newQuestion) newErrors.newQuestion = "Question is required";
	if (newOptions.some((opt) => !opt)) {
		newErrors.newOptions = "All options are required";
	} else if (new Set(newOptions).size !== newOptions.length) {
		newErrors.newOptions = "Options must be unique";
	}
	if (!newAnswer) {
		newErrors.newAnswer = "Answer is required";
	} else if (!newOptions.includes(newAnswer)) {
		newErrors.newAnswer = "Answer must be one of the provided options";
	}
	setErrors(newErrors);
	return Object.keys(newErrors).length === 0;
};
