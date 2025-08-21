"use client";
import { useState } from "react";
import {
	ContentType,
	ContentStatus,
	CreateLessonContentInput,
	UpdateLessonContentInput,
	LessonContent,
} from "@/types/content";
import { useCreateContent } from "@/hooks/content/useCreateContent";
import { useUpdateContent } from "@/hooks/content/useUpdateContent";
import { useGetLessonById } from "@/hooks/lesson/useGetLessonById";
import { getCoursePresignedUrl, uploadFileToS3 } from "@/api/file";
import { validateForm } from "./ContentValidation";
import { ContentTypeSelector } from "./ContentTypeSelector";
import { TitleInput } from "./ContentTitleInput";
import { DescriptionInput } from "./ContentDescriptionInput";
import { QuizInput } from "./ContentQuizInput";
import { ThumbnailUploadInput } from "./ContentThumbnailInputSection";
import { FileUploadInput } from "./ContentFileUploadInput";
import { Button } from "../ui/button";

interface ContentInputFormProps {
	lessonId: string;
	initialData?: LessonContent | null;
	onSuccess?: () => void;
}

export const ContentInputForm = ({
	lessonId,
	initialData,
	onSuccess,
}: ContentInputFormProps) => {
	const { data: lesson } = useGetLessonById(lessonId);
	const [type, setType] = useState<ContentType>(
		initialData?.type || ContentType.VIDEO,
	);
	const [title, setTitle] = useState(initialData?.title || "");
	const [description, setDescription] = useState(
		initialData?.description || "",
	);
	const [file, setFile] = useState<File | null>(null);
	const [fileUrl, setFileUrl] = useState(initialData?.fileUrl || "");
	const [thumbnail, setThumbnail] = useState<File | null>(null);
	const [thumbnailUrl, setThumbnailUrl] = useState(
		initialData?.thumbnailUrl || "",
	);
	const [questions, setQuestions] = useState<
		{ question: string; options: string[]; correctAnswer: string }[]
	>(initialData?.quizQuestions || []);
	const [uploadStatus, setUploadStatus] = useState<
		"idle" | "uploading" | "success" | "error"
	>("idle");
	const [uploadProgress, setUploadProgress] = useState(0);
	const [thumbnailUploadStatus, setThumbnailUploadStatus] = useState<
		"idle" | "uploading" | "success" | "error"
	>("idle");
	const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);
	const [errors, setErrors] = useState<{
		title?: string;
		file?: string;
		thumbnail?: string;
		questions?: string;
		newQuestion?: string;
		newOptions?: string;
		newAnswer?: string;
	}>({});

	const { mutate: createContent, isPending: isCreating } = useCreateContent();
	const { mutate: updateContent, isPending: isUpdating } = useUpdateContent();

	const isUploading =
		uploadStatus === "uploading" || thumbnailUploadStatus === "uploading";
	const isSubmitting = isCreating || isUpdating || isUploading;

	const isEditing = !!initialData?.id;

	const handleCancel = () => {
		setType(initialData?.type || ContentType.VIDEO);
		setTitle(initialData?.title || "");
		setDescription(initialData?.description || "");
		setFile(null);
		setFileUrl(initialData?.fileUrl || "");
		setThumbnail(null);
		setThumbnailUrl(initialData?.thumbnailUrl || "");
		setQuestions(initialData?.quizQuestions || []);
		setUploadStatus("idle");
		setUploadProgress(0);
		setThumbnailUploadStatus("idle");
		setThumbnailUploadProgress(0);
		setErrors({});
		onSuccess?.();
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (
			!validateForm(
				type,
				title,
				file,
				fileUrl,
				thumbnail,
				thumbnailUrl,
				questions,
				setErrors,
			)
		)
			return;

		let finalFileUrl = fileUrl;
		let finalThumbnailUrl = thumbnailUrl;
		
		// Upload file if provided
		if (file && lesson?.courseId) {
			try {
				setUploadStatus("uploading");
				const contentType = type === ContentType.VIDEO ? 'video' : 'document';
				const { uploadUrl, key } = await getCoursePresignedUrl(
					file.name,
					file.type,
					lesson.courseId,
					contentType
				);
				await uploadFileToS3(file, uploadUrl, (progress) => {
					setUploadProgress(progress);
				});
				finalFileUrl = key;
				setUploadStatus("success");
			} catch {
				setUploadStatus("error");
				setErrors((prev) => ({
					...prev,
					file: "Failed to upload file",
				}));
				return;
			}
		}
		
		// Upload thumbnail if provided
		if (thumbnail && type === ContentType.VIDEO && lesson?.courseId) {
			try {
				setThumbnailUploadStatus("uploading");
				const { uploadUrl, key } = await getCoursePresignedUrl(
					thumbnail.name,
					thumbnail.type,
					lesson.courseId,
					'thumbnail'
				);
				await uploadFileToS3(thumbnail, uploadUrl, (progress) => {
					setThumbnailUploadProgress(progress);
				});
				finalThumbnailUrl = key;
				setThumbnailUploadStatus("success");
			} catch  {
				setThumbnailUploadStatus("error");
				setErrors((prev) => ({
					...prev,
					thumbnail: "Failed to upload thumbnail",
				}));
				return;
			}
		}

		const data: CreateLessonContentInput = {
			lessonId,
			type,
			status:
				finalFileUrl || questions.length > 0
					? ContentStatus.PUBLISHED
					: ContentStatus.DRAFT,
			title,
			description: description || undefined,
			fileUrl: type !== ContentType.QUIZ ? finalFileUrl : undefined,
			thumbnailUrl: type === ContentType.VIDEO ? finalThumbnailUrl : undefined,
			quizQuestions: type === ContentType.QUIZ ? questions : undefined,
		};

		if (initialData?.id) {
			const updateData: UpdateLessonContentInput = {
				id: initialData.id,
				lessonId,
				type: data.type,
				status: data.status,
				title: data.title,
				description: data.description,
				fileUrl: data.fileUrl,
				thumbnailUrl: data.thumbnailUrl,
				quizQuestions: data.quizQuestions,
			};
			updateContent(updateData, {
				onSuccess: () => {
					onSuccess?.();
				},
				onError: (error) => setErrors({ title: error.message }),
			});
		} else {
			createContent(data, {
				onSuccess: () => {
					onSuccess?.();
				},
				onError: (error) => setErrors({ title: error.message }),
			});
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-8 p-8">

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{isEditing ? (
					<div className="flex flex-col">
						<label className="block text-sm font-semibold mb-2">
							Content Type
						</label>
						<div className="p-3 border">
							{type}
						</div>
					</div>
				) : (
					<ContentTypeSelector type={type} setType={setType} />
				)}
				<TitleInput title={title} setTitle={setTitle} errors={errors} />
			</div>

			<DescriptionInput
				description={description}
				setDescription={setDescription}
			/>

			{(type === ContentType.VIDEO || type === ContentType.DOCUMENT) && (
				<FileUploadInput
					type={type}
					file={file}
					setFile={setFile}
					fileUrl={fileUrl}
					setFileUrl={setFileUrl}
					setUploadStatus={setUploadStatus}
					setUploadProgress={setUploadProgress}
					uploadStatus={uploadStatus}
					uploadProgress={uploadProgress}
					errors={errors}
					courseId={lesson?.courseId}
				/>
			)}

			{type === ContentType.VIDEO && (
				<ThumbnailUploadInput
					file={thumbnail}
					setFile={setThumbnail}
					fileUrl={thumbnailUrl}
					setFileUrl={setThumbnailUrl}
					uploadStatus={thumbnailUploadStatus}
					uploadProgress={thumbnailUploadProgress}
					errors={errors}
					setUploadProgress={setThumbnailUploadProgress}
					setUploadStatus={setThumbnailUploadStatus}
					courseId={lesson?.courseId}
				/>
			)}

			{type === ContentType.QUIZ && (
				<QuizInput
					questions={questions}
					setQuestions={setQuestions}
					errors={errors}
					setErrors={(quizErrors) =>
						setErrors((prev) => ({ ...prev, ...quizErrors }))
					}
				/>
			)}

			
			<div className="flex space-x-6 pt-4">
				<Button
					type="submit"
					disabled={isSubmitting}
					className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 font-medium"
				>
					{isSubmitting ? (
						<span className="flex items-center justify-center">
							<svg
								className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Processing...
						</span>
					) : (
						"Submit"
					)}
				</Button>
				<Button
					onClick={handleCancel}
					disabled={isSubmitting}
					className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 font-medium"
				>
					Cancel
				</Button>
			</div>
		</form>
	);
};
