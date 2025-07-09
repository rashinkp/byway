import { useState } from "react";
import { Star } from "lucide-react";
import { useCreateCourseReview } from "@/hooks/course-review/useCreateCourseReview";
import { CreateCourseReviewParams } from "@/types/course-review";
import ErrorDisplay from "@/components/ErrorDisplay";

interface AddReviewFormProps {
  courseId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AddReviewForm({
  courseId,
  onSuccess,
  onCancel,
}: AddReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const { createReview, isLoading, error } = useCreateCourseReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      return;
    }

    const reviewData: CreateCourseReviewParams = {
      courseId,
      rating,
      title: title.trim() || undefined,
      comment: comment.trim() || undefined,
    };

    try {
      await createReview(reviewData);
      onSuccess();
    } catch  {
      // Error is handled by the hook
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isFilled = starValue <= (hoveredRating || rating);
      
      return (
        <button
          key={i}
          type="button"
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          className="transition-colors"
        >
          <Star
            className={`w-6 h-6 ${
              isFilled ? "text-[var(--color-warning)] fill-current" : "text-[var(--color-muted)]"
            } hover:text-[var(--color-warning)]`}
          />
        </button>
      );
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <ErrorDisplay error={error} title="Review Error" description="There was a problem submitting your review. Please try again." compact />
      )}

      {/* Rating */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[var(--color-primary-dark)]">
          Rating *
        </label>
        <div className="flex items-center space-x-1">
          {renderStars()}
          <span className="ml-2 text-sm text-[var(--color-muted)]">
            {rating > 0 && `${rating} star${rating > 1 ? 's' : ''}`}
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-[var(--color-primary-dark)]">
          Title (optional)
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          className="w-full px-3 py-2 border border-[var(--color-primary-light)]/40 rounded-lg focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary-light)] bg-[var(--color-surface)] text-[var(--color-primary-dark)]"
          placeholder="Brief summary of your experience"
        />
        <p className="text-xs text-[var(--color-muted)]">
          {title.length}/100 characters
        </p>
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <label htmlFor="comment" className="block text-sm font-medium text-[var(--color-primary-dark)]">
          Review (optional)
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={1000}
          rows={4}
          className="w-full px-3 py-2 border border-[var(--color-primary-light)]/40 rounded-lg focus:ring-2 focus:ring-[var(--color-primary-light)] focus:border-[var(--color-primary-light)] bg-[var(--color-surface)] text-[var(--color-primary-dark)] resize-none"
          placeholder="Share your detailed thoughts about this course..."
        />
        <p className="text-xs text-[var(--color-muted)]">
          {comment.length}/1000 characters
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-[var(--color-primary-dark)] bg-[var(--color-background)] rounded-lg hover:bg-[var(--color-primary-light)]/10 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={rating === 0 || isLoading}
          className="px-4 py-2 bg-[var(--color-primary-light)] text-[var(--color-surface)] rounded-lg hover:bg-[var(--color-primary-dark)] disabled:bg-[var(--color-muted)] disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </form>
  );
} 