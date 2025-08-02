"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Edit,
	Trash2,
	Eye,
	EyeOff,
	ArrowUpRight,
	CalendarClock,
	Hash,
	StickyNote,
	Loader2,
} from "lucide-react";
import { toast } from "sonner";

// Component imports
import { LessonFormModal } from "@/components/lesson/LessonFormModal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AlertComponent } from "../ui/AlertComponent";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Skeleton } from "@/components/ui/skeleton";

// Utilities and API
import { formatDate } from "@/utils/formatDate";
import { deleteLesson } from "@/api/lesson";
import { ILesson } from "@/types/lesson";
import { LessonFormData, lessonSchema } from "@/lib/validations/lesson";
import { Button } from "../ui/button";

interface LessonDetailSectionProps {
	lesson: ILesson;
	courseId: string;
	onUpdateLesson: (data: LessonFormData) => void;
	isLoading: boolean;
	isUpdating?: boolean;
	error: Error | null;
	onRetry?: () => void;
}

export function LessonDetailSection({
	lesson,
	courseId,
	onUpdateLesson,
	isLoading,
	isUpdating = false,
	error,
	onRetry,
}: LessonDetailSectionProps) {
	const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isPublishing, setIsPublishing] = useState(false);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const router = useRouter();

	const handleEditLesson = async (data: LessonFormData) => {
		setIsSubmitting(true);
		try {
			lessonSchema.parse(data);
			onUpdateLesson(data);
			setIsLessonModalOpen(false);
		} catch (err) {
			console.error(err);
			toast.error("Failed to update lesson");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleTogglePublish = async () => {
		setIsPublishing(true);
		try {
			const updatedStatus =
				lesson.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
			const data: LessonFormData = {
				title: lesson.title,
				order: lesson.order,
				status: updatedStatus,
				description: lesson.description || "",
			};
			lessonSchema.parse(data);
			onUpdateLesson(data);
		} catch (err) {
			console.error("Error updating lesson status:", err);
		} finally {
			setIsPublishing(false);
		}
	};

	const handleOpenConfirm = () => setConfirmOpen(true);

	const handleConfirmDelete = async () => {
		if (!lesson.id) {
			toast.error("Lesson ID is missing");
			return;
		}

		setIsSubmitting(true);
		try {
			await deleteLesson(lesson.id);
			router.replace(`/instructor/courses/${courseId}`);
		} catch (err) {
			console.error("Error deleting lesson:", err);
		} finally {
			setIsSubmitting(false);
			setConfirmOpen(false);
		}
	};

	if (error) {
		return (
			<ErrorDisplay
				error={error}
				onRetry={onRetry}
				title="Error loading lesson"
				description="There was a problem loading this lesson. Please try again."
			/>
		);
	}

	if (isLoading) {
		return (
			<div className="p-6">
				<Skeleton className="h-8 w-1/2 mb-4" />
				<Skeleton className="h-4 w-1/3 mb-2" />
				<Skeleton className="h-32 w-full mb-4" />
				<Skeleton className="h-4 w-1/4 mb-2" />
				<Skeleton className="h-4 w-1/4 mb-2" />
			</div>
		);
	}

	return (
		<div className="overflow-hidden bg-white dark:bg-[#232323] border border-gray-200 dark:border-gray-700 rounded-xl">
			{/* Header section */}
			<div className="border-b border-gray-200 dark:border-gray-700 p-4">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
					<h1 className="text-2xl font-bold text-black dark:text-white">{lesson.title}</h1>
					<div className="flex flex-wrap gap-6">
						<Button
							onClick={() => setIsLessonModalOpen(true)}
							disabled={isLoading || isUpdating || isSubmitting || isPublishing}

						>
							{isPublishing || isUpdating || isSubmitting || isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Loading...
								</>
							) : (
								<>
									<Edit className="mr-2 h-4 w-4" />
									Edit
								</>
							)}
						</Button>

						<Button	
							onClick={handleTogglePublish}
							disabled={isLoading || isUpdating || isSubmitting || isPublishing}
						>
							{isPublishing || isUpdating || isSubmitting || isLoading ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									{lesson.status === "PUBLISHED" ? "Making Draft..." : "Publishing..."}
								</>
							) : lesson.status === "PUBLISHED" ? (
								<>
									<EyeOff className="mr-2 h-4 w-4" />
									Make Draft
								</>
							) : (
								<>
									<Eye className="mr-2 h-4 w-4" />
									Publish
									</>
								)}
						</Button>

						<Button
							onClick={handleOpenConfirm}
							disabled={isLoading || isUpdating || isSubmitting || isPublishing}
						>
							<Trash2 className="mr-2 h-4 w-4" />
							Delete
						</Button>
					</div>
				</div>
			</div>

			{/* Lesson details */}
			<div className="p-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
					<div className="space-y-4">
						<div className="flex items-start gap-3">
							<StickyNote className="h-5 w-5 text-gray-400 mt-1" />
							<div>
								<h3 className="text-gray-700 dark:text-gray-300 font-medium text-sm">
									Description
								</h3>
								<p className="text-black dark:text-white">
									{lesson.description || "No description provided"}
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<Hash className="h-5 w-5 text-gray-400" />
							<div>
								<h3 className="text-gray-700 dark:text-gray-300 font-medium text-sm">Order</h3>
								<p className="text-black dark:text-white">{lesson.order}</p>
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<CalendarClock className="h-5 w-5 text-gray-400" />
							<div>
								<h3 className="text-gray-700 dark:text-gray-300 font-medium text-sm">Created</h3>
								<p className="text-black dark:text-white">{formatDate(lesson.createdAt)}</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<CalendarClock className="h-5 w-5 text-gray-400" />
							<div>
								<h3 className="text-gray-700 dark:text-gray-300 font-medium text-sm">
									Last Updated
								</h3>
								<p className="text-black dark:text-white">{formatDate(lesson.updatedAt)}</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<ArrowUpRight className="h-5 w-5 text-gray-400" />
							<div>
								<h3 className="text-gray-700 dark:text-gray-300 font-medium text-sm">Status</h3>
								<div className="flex items-center gap-3 mt-1">
									<StatusBadge isActive={!lesson.deletedAt} />
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
											lesson.status === "PUBLISHED"
												? "bg-[#facc15] text-black dark:bg-[#facc15] dark:text-[#18181b]"
												: "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white"
										}`}
									>
										{lesson.status === "PUBLISHED" ? "Published" : "Draft"}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Modals */}
			<LessonFormModal
				open={isLessonModalOpen}
				onOpenChange={setIsLessonModalOpen}
				onSubmit={handleEditLesson}
				initialData={{
					title: lesson.title,
					description: lesson.description || "",
					order: lesson.order,
					status: lesson.status,
				}}
				courseId={courseId}
				isSubmitting={isSubmitting}
			/>

			<AlertComponent
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				title="Delete Lesson"
				description="Are you sure you want to delete this lesson? This action cannot be undone and all associated content will be permanently removed."
				confirmText="Delete"
				cancelText="Cancel"
				onConfirm={handleConfirmDelete}
			/>
		</div>
	);
}
