import type { ICart } from "@/types/cart";
import { Award, BookOpen, Clock, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CartItemProps {
  item: ICart;
  isRemoving: boolean;
  onRemove: (courseId: string) => void;
}

// Single Cart Item Component
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
    <div className="p-6 border-b last:border-b-0 hover:bg-blue-50/50 transition-colors">
      <div className="flex gap-4">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-32 h-20 object-cover rounded-lg bg-blue-50 flex-shrink-0"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg text-gray-800">
                {course.title}
              </h3>
              <p className="text-gray-500 text-sm mt-1">{course.creator?.name}</p>
            </div>
            <button
              onClick={() => course.id && onRemove(course.id)}
              className="text-gray-400 hover:text-red-500 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Remove from cart"
              disabled={isRemoving}
            >
              <Trash2 size={18} />
            </button>
          </div>
          <div className="flex items-center mt-3 text-sm text-gray-500 space-x-4">
            <span className="flex items-center">
              <Clock size={16} className="mr-1 text-blue-600" />
              {course.duration}
            </span>
            <span className="flex items-center">
              <BookOpen size={16} className="mr-1 text-blue-600" />
              {course.lectures || 0} lectures
            </span>
            <span className="flex items-center">
              <Award size={16} className="mr-1 text-blue-600" />
              {course.level}
            </span>
          </div>
        </div>
        <div className="text-right min-w-[120px]">
          <div className="font-bold text-lg text-blue-700">${Number(offerPrice || 0).toFixed(2)}</div>
          <div className="text-gray-500 line-through text-sm">
            ${originalPrice.toFixed(2)}
          </div>
          <Badge 
            variant="outline"
            className="bg-red-50 text-red-600 border-red-200 mt-1"
          >
            {discountPercentage}% OFF
          </Badge>
        </div>
      </div>
    </div>
  );
}


