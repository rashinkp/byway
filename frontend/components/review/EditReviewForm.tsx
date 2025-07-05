import { useState } from "react";
import { Star } from "lucide-react";
import { CourseReview } from "@/types/course-review";

interface EditReviewFormProps {
  review: CourseReview;
  onSave: (data: { rating?: number; title?: string; comment?: string }) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function EditReviewForm({
  review,
  onSave,
  onCancel,
  isLoading,
}: EditReviewFormProps) {
  const [rating, setRating] = useState(review.rating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState(review.title || "");
  const [comment, setComment] = useState(review.comment || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      return;
    }

    onSave({
      rating,
      title: title.trim() || undefined,
      comment: comment.trim() || undefined,
    });
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
        <label htmlFor="edit-title" className="block text-sm font-medium text-[var(--color-primary-dark)]">
          Title (optional)
        </label>
        <input
          type="text"
          id="edit-title"
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
        <label htmlFor="edit-comment" className="block text-sm font-medium text-[var(--color-primary-dark)]">
          Review (optional)
        </label>
        <textarea
          id="edit-comment"
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
          disabled={isLoading}
          className="px-4 py-2 text-[var(--color-primary-dark)] bg-[var(--color-background)] rounded-lg hover:bg-[var(--color-primary-light)]/10 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={rating === 0 || isLoading}
          className="px-4 py-2 bg-[var(--color-primary-light)] text-[var(--color-surface)] rounded-lg hover:bg-[var(--color-primary-dark)] disabled:bg-[var(--color-muted)] disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
} 