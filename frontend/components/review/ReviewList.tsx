import { useState } from "react";
import { CourseReview } from "@/types/course-review";
import { useAuth } from "@/hooks/auth/useAuth";
import { useDeleteCourseReview } from "@/hooks/course-review/useDeleteCourseReview";
import { useUpdateCourseReview } from "@/hooks/course-review/useUpdateCourseReview";
import { useDisableReview } from "@/hooks/course-review/useDisableReview";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import EditReviewForm from "./EditReviewForm";
import ReviewItem from "./ReviewItem";
import React from "react";
import ErrorDisplay from "@/components/ErrorDisplay";
import { Skeleton } from "@/components/ui/skeleton";

interface ReviewListProps {
	reviews: CourseReview[];
	isLoading: boolean;
	error: { message: string } | null;
	total: number;
	courseId: string;
	activeFilter: "all" | "my";
	userRole?: "USER" | "ADMIN" | "INSTRUCTOR";
	disabledFilter?: "all" | "disabled";
}

export default function ReviewList({
	reviews,
	isLoading,
	error,
	total,
	courseId,
	activeFilter,
	userRole = "USER",
	disabledFilter,
}: ReviewListProps) {
	const { user } = useAuth();
	const [currentPage, setCurrentPage] = useState(1);
	const [editingReview, setEditingReview] = useState<string | null>(null);
	const [deletingReview, setDeletingReview] = useState<string | null>(null);
	const [disablingReview, setDisablingReview] = useState<string | null>(null);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [showDisableDialog, setShowDisableDialog] = useState(false);
	const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
	const [reviewToDisable, setReviewToDisable] = useState<{
		id: string;
		isDisabled: boolean;
	} | null>(null);

	const { deleteReview, isLoading: isDeleting } = useDeleteCourseReview();
	const { updateReview, isLoading: isUpdating } = useUpdateCourseReview();
	const { disableReview, isLoading: isDisabling } = useDisableReview(courseId);

	// Filter reviews based on disabled filter
	const filteredReviews = React.useMemo(() => {
		if (!disabledFilter || disabledFilter === "all") {
			return reviews;
		}

		return reviews.filter((review) => {
			const isDisabled = review.deletedAt !== null;
			if (disabledFilter === "disabled") {
				return isDisabled;
			}
			return true;
		});
	}, [reviews, disabledFilter]);

	const handleDeleteReview = async (reviewId: string) => {
			await deleteReview(reviewId);
			setDeletingReview(null);
			setShowDeleteDialog(false);
			setReviewToDelete(null);
	};

	const handleUpdateReview = async (
		reviewId: string,
		data: { rating?: number; title?: string; comment?: string },
	) => {
			await updateReview(reviewId, data);
			setEditingReview(null);
	};

	const handleDisableReview = async (reviewId: string) => {
			await disableReview(reviewId);
			setDisablingReview(null);
			setShowDisableDialog(false);
			setReviewToDisable(null);
		
	};

	const handleDeleteClick = (reviewId: string) => {
		setReviewToDelete(reviewId);
		setShowDeleteDialog(true);
	};

	const handleDisableClick = (reviewId: string, isDisabled: boolean) => {
		setReviewToDisable({ id: reviewId, isDisabled });
		setShowDisableDialog(true);
	};

	const confirmDelete = () => {
		if (reviewToDelete) {
			setDeletingReview(reviewToDelete);
			handleDeleteReview(reviewToDelete);
		}
	};

	const confirmDisable = () => {
		if (reviewToDisable) {
			setDisablingReview(reviewToDisable.id);
			handleDisableReview(reviewToDisable.id);
		}
	};

	const cancelDelete = () => {
		setShowDeleteDialog(false);
		setReviewToDelete(null);
	};

	const cancelDisable = () => {
		setShowDisableDialog(false);
		setReviewToDisable(null);
	};

	if (isLoading) {
		return (
			<div className="space-y-4">
				{[1, 2, 3].map((i) => (
					<Skeleton key={i} className="h-24 w-full rounded-xl" />
				))}
			</div>
		);
	}

	if (error) {
		return (
			<ErrorDisplay
				error={error}
				title="Review List Error"
				description="There was a problem loading the reviews. Please try again."
				compact
			/>
		);
	}

	if (filteredReviews.length === 0) {
		let message = "No reviews yet.";

		if (userRole === "USER" && activeFilter === "my") {
			message = "You haven't reviewed this course yet.";
		} else if (userRole === "ADMIN" && activeFilter === "my") {
			message = "You haven't reviewed this course yet.";
		} else if (userRole === "ADMIN" && disabledFilter === "disabled") {
			message = "No disabled reviews found.";
		} else if (userRole === "INSTRUCTOR") {
			message = "No student reviews yet.";
		}

		return (
			<div className="bg-[var(--color-surface)] border border-[var(--color-primary-light)]/20 rounded-xl p-8 text-center">
				<p className="text-[var(--color-muted)] text-sm">{message}</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Reviews */}
			<div className="space-y-4">
				{filteredReviews.map((review) => (
					<div
						key={review.id}
						className="bg-[var(--color-surface)] border border-[var(--color-primary-light)]/20 rounded-xl p-4 hover:bg-[var(--color-background)] transition-all duration-200"
					>
						{editingReview === review.id ? (
							<EditReviewForm
								review={review}
								onSave={(data) => handleUpdateReview(review.id, data)}
								onCancel={() => setEditingReview(null)}
								isLoading={isUpdating}
							/>
						) : (
							<ReviewItem
								review={review}
								isOwner={user?.id === review.userId}
								onEdit={() => setEditingReview(review.id)}
								onDelete={() => handleDeleteClick(review.id)}
								onDisable={
									userRole === "ADMIN"
										? () =>
												handleDisableClick(review.id, review.deletedAt !== null)
										: undefined
								}
								isDeleting={deletingReview === review.id}
								isDisabling={disablingReview === review.id}
								userRole={userRole}
								isDisabled={review.deletedAt !== null}
							/>
						)}
					</div>
				))}
			</div>

			{/* Pagination */}
			{total > 10 && (
				<div className="flex items-center justify-center space-x-2 pt-4">
					<button
						onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
						disabled={currentPage === 1}
						className="px-3 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
					>
						Previous
					</button>
					<span className="px-3 py-2 text-sm text-gray-600">
						Page {currentPage} of {Math.ceil(total / 10)}
					</span>
					<button
						onClick={() =>
							setCurrentPage(Math.min(Math.ceil(total / 10), currentPage + 1))
						}
						disabled={currentPage >= Math.ceil(total / 10)}
						className="px-3 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
					>
						Next
					</button>
				</div>
			)}

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Review</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this review? This action cannot be
							undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDelete}
							className="bg-red-600 hover:bg-red-700 text-white"
							disabled={isDeleting}
						>
							{isDeleting ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Disable/Enable Confirmation Dialog */}
			<AlertDialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{reviewToDisable?.isDisabled ? "Enable Review" : "Disable Review"}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{reviewToDisable?.isDisabled
								? "Are you sure you want to enable this review? It will be visible to all users."
								: "Are you sure you want to disable this review? It will be hidden from users but can be re-enabled later."}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={cancelDisable}>
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={confirmDisable}
							className="bg-orange-600 hover:bg-orange-700 text-white"
							disabled={isDisabling}
						>
							{isDisabling
								? "Processing..."
								: reviewToDisable?.isDisabled
									? "Enable"
									: "Disable"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
