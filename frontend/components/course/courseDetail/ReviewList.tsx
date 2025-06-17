import { useState } from "react";
import { CourseReview } from "@/types/course-review";
import { useAuth } from "@/hooks/auth/useAuth";
import { useDeleteCourseReview } from "@/hooks/course-review/useDeleteCourseReview";
import { useUpdateCourseReview } from "@/hooks/course-review/useUpdateCourseReview";
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

interface ReviewListProps {
  reviews: CourseReview[];
  isLoading: boolean;
  error: { message: string } | null;
  total: number;
  courseId: string;
  activeFilter: 'all' | 'my';
}

export default function ReviewList({
  reviews,
  isLoading,
  error,
  total,
  courseId,
  activeFilter,
}: ReviewListProps) {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [deletingReview, setDeletingReview] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const { deleteReview, isLoading: isDeleting } = useDeleteCourseReview();
  const { updateReview, isLoading: isUpdating } = useUpdateCourseReview();

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteReview(reviewId);
      setDeletingReview(null);
      setShowDeleteDialog(false);
      setReviewToDelete(null);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleUpdateReview = async (reviewId: string, data: { rating?: number; title?: string; comment?: string }) => {
    try {
      await updateReview(reviewId, data);
      setEditingReview(null);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleDeleteClick = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (reviewToDelete) {
      setDeletingReview(reviewToDelete);
      handleDeleteReview(reviewToDelete);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setReviewToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error.message}</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-500">
          {activeFilter === 'my' 
            ? "You haven't reviewed this course yet." 
            : "No reviews yet. Be the first to review this course!"
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
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
                isDeleting={deletingReview === review.id && isDeleting}
              />
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {total > 10 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-3 py-2 text-sm text-gray-600">
            Page {currentPage} of {Math.ceil(total / 10)}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(Math.ceil(total / 10), currentPage + 1))}
            disabled={currentPage >= Math.ceil(total / 10)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
              Are you sure you want to delete this review? This action cannot be undone.
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
    </div>
  );
} 