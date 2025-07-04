"use client";

import { useState } from "react";
import { ContentType } from "@/types/content";
import { toast } from "sonner";
import { useGetContentByLessonId } from "@/hooks/content/useGetContentByLessonId";
import { useDeleteContent } from "@/hooks/content/useDeleteContent";
import { ContentSectionSkeleton } from "../skeleton/LessonContentSectionSkeleton";
import { AlertComponent } from "../ui/AlertComponent";
import { ContentInputForm } from "./ContentInputForm";
import {
	Pencil,
	Trash2,
	Plus,
	Video,
	FileText,
	HelpCircle,
	ChevronRight,
	Check,
	X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContentSectionProps {
	lessonId: string;
}

export const ContentSection = ({ lessonId }: ContentSectionProps) => {
	const { data: content, isLoading } = useGetContentByLessonId(lessonId);
	const { mutate: deleteContent, isPending: isDeleting } =
		useDeleteContent(lessonId);
	const [isEditing, setIsEditing] = useState(false);
	const [isAlertOpen, setIsAlertOpen] = useState(false);
	const [deleteContentId, setDeleteContentId] = useState<string | null>(null);

	const handleDelete = (contentId: string) => {
		setDeleteContentId(contentId);
		setIsAlertOpen(true);
	};

	const handleConfirmDelete = () => {
		if (deleteContentId) {
			deleteContent(deleteContentId, {
				onSuccess: () => {
					setIsEditing(false);
				},
				onError: (error: Error) => toast.error(error.message),
			});
		}
	};

	const handleFormSuccess = () => {
		setIsEditing(false);
	};

	const getContentTypeIcon = (type: ContentType) => {
		switch (type) {
			case ContentType.VIDEO:
				return <Video className="w-5 h-5 text-blue-500" />;
			case ContentType.DOCUMENT:
				return <FileText className="w-5 h-5 text-blue-500" />;
			case ContentType.QUIZ:
				return <HelpCircle className="w-5 h-5 text-blue-500" />;
			default:
				return null;
		}
	};

	if (isLoading) {
		return <ContentSectionSkeleton />;
	}

	if (isEditing) {
		return (
			<div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 backdrop-blur-sm">
				<h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-6">
					{content ? "Edit Content" : "Add New Content"}
				</h2>
				<ContentInputForm
					lessonId={lessonId}
					initialData={content}
					onSuccess={handleFormSuccess}
				/>
			</div>
		);
	}

	if (!content) {
		return (
			<div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 backdrop-blur-sm">
				<div className="text-center py-12">
					<div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
						<Plus className="w-8 h-8 text-blue-600" />
					</div>
					<h2 className="text-2xl font-bold text-gray-800 mb-3">
						No Content Yet
					</h2>
					<p className="text-gray-500 mb-6 max-w-md mx-auto">
						This lesson doesn't have any content yet. Add videos, documents, or
						quizzes to get started.
					</p>
					<Button
						onClick={() => setIsEditing(true)}
						className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-6 py-2 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all"
					>
						<Plus className="mr-2 h-4 w-4" />
						Add Content
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
			{/* Content header */}
			<div className="border-b border-gray-100 p-6">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
					<div className="flex items-center gap-3">
						{getContentTypeIcon(content.type)}
						<h2 className="text-xl font-bold text-gray-800">{content.title}</h2>
					</div>
					<div className="flex gap-3">
						<Button
							onClick={() => setIsEditing(true)}
							className="text-blue-600 hover:text-blue-700  bg-inherit hover:bg-inherit"
							disabled={isDeleting}
							size="sm"
						>
							<Pencil className="mr-2 h-4 w-4" />
							Edit
						</Button>
						<Button
							onClick={() => handleDelete(content.id)}
							disabled={isDeleting}
							className="text-red-600 hover:text-red-700 bg-inherit hover:bg-inherit"
							size="sm"
						>
							<Trash2 className="mr-2 h-4 w-4" />
							{isDeleting ? "Deleting..." : "Delete"}
						</Button>
					</div>
				</div>
				{content.description && (
					<p className="mt-3 text-gray-600 leading-relaxed">
						{content.description}
					</p>
				)}
			</div>

			{/* Content body */}
			<div className="p-6">
				{content.type === ContentType.VIDEO && content.fileUrl && (
					<div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
						<div
							className="relative w-full"
							style={{ paddingTop: "56.25%" /* 16:9 aspect ratio */ }}
						>
							<video
								src={content.fileUrl}
								controls
								className="absolute top-0 left-0 w-full h-full object-contain bg-black"
								poster={content.thumbnailUrl || undefined}
							/>
						</div>
					</div>
				)}

				{content.type === ContentType.DOCUMENT && content.fileUrl && (
					<div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
						<FileText className="w-10 h-10 text-blue-500 mr-4" />
						<div>
							<h3 className="text-gray-800 font-medium">Document</h3>
							<a
								href={content.fileUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="text-blue-600 hover:text-blue-800 flex items-center mt-1 group"
							>
								View Document
								<ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
							</a>
						</div>
					</div>
				)}

				{content.type === ContentType.QUIZ && content.quizQuestions && (
					<div className="space-y-6">
						{content.quizQuestions.map((q, index) => (
							<div
								key={index}
								className="bg-blue-50 p-6 rounded-xl border border-blue-200"
							>
								<h3 className="text-lg font-medium text-gray-800 mb-4">
									Question {index + 1}: {q.question}
								</h3>
								<ul className="space-y-3 mb-4">
									{q.options.map((opt, i) => (
										<li
											key={i}
											className={`flex items-center p-3 rounded-lg ${
												opt === q.correctAnswer
													? "bg-green-100 border border-green-200"
													: "bg-white border border-gray-200"
											}`}
										>
											{opt === q.correctAnswer ? (
												<Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
											) : (
												<X className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
											)}
											<span
												className={`${
													opt === q.correctAnswer
														? "text-gray-800 font-medium"
														: "text-gray-600"
												}`}
											>
												{opt}
											</span>
											{opt === q.correctAnswer && (
												<span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
													Correct Answer
												</span>
											)}
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				)}
			</div>

			<AlertComponent
				open={isAlertOpen}
				onOpenChange={setIsAlertOpen}
				title="Delete Content"
				description="Are you sure you want to delete this content? This action cannot be undone."
				confirmText="Delete"
				cancelText="Cancel"
				onConfirm={handleConfirmDelete}
			/>
		</div>
	);
};
