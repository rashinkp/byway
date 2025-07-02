import type { ICart } from "@/types/cart";
import { Award, BookOpen, Clock, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface CartItemProps {
  item: ICart;
  isRemoving: boolean;
  onRemove: (courseId: string) => void;
}

export function CartItem({ item, isRemoving, onRemove }: CartItemProps) {
  const course = item.course;
  if (!course) return null;

  const offerPrice =
    typeof course.offer === "string"
      ? parseFloat(course.offer)
      : typeof course.offer === "number"
      ? course.offer
      : course.price ?? 0;

  const originalPrice =
    typeof course.price === "string"
      ? parseFloat(course.price)
      : typeof course.price === "number"
      ? course.price
      : 0;

  const discountPercentage = Math.round(
    ((originalPrice || 0) - (Number(offerPrice) || 0)) / (originalPrice || 1) * 100
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-sm hover:shadow-md transition-all duration-300 mb-4"
    >
      <img
        src={course.thumbnail}
        alt={course.title}
        className="w-full sm:w-28 sm:h-16 object-cover rounded-md bg-[var(--color-background)] flex-shrink-0"
      />
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-medium text-[var(--color-primary-dark)] leading-tight">
              {course.title}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-muted)]">{course.creator?.name}</p>
          </div>
          <button
            onClick={() => course.id && onRemove(course.id)}
            className="p-2 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Remove from cart"
            disabled={isRemoving}
          >
            <Trash2 size={16} />
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[var(--color-muted)]">
          <span className="flex items-center gap-1">
            <Clock size={14} className="text-[var(--color-primary-light)]" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen size={14} className="text-[var(--color-primary-light)]" />
            {course.lectures || 0} lectures
          </span>
          <span className="flex items-center gap-1">
            <Award size={14} className="text-[var(--color-accent)]" />
            {course.level}
          </span>
        </div>
      </div>
      <div className="text-right space-y-1 min-w-[100px]">
        <div className="text-base sm:text-lg font-semibold text-[var(--color-primary-light)]">
          ${Number(offerPrice || 0).toFixed(2)}
        </div>
        {discountPercentage > 0 && (
          <>
            <div className="text-xs text-[var(--color-muted)] line-through">
              ${originalPrice.toFixed(2)}
            </div>
            <Badge
              variant="outline"
              className="text-xs bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]"
            >
              {discountPercentage}% OFF
            </Badge>
          </>
        )}
      </div>
    </motion.div>
  );
}