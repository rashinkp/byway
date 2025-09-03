import { useState } from "react";
import { Star, MoreVertical, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { CourseReview } from "@/types/course-review";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";

interface ReviewItemProps {
  review: CourseReview;
  isOwner: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onDisable?: () => void;
  isDeleting: boolean;
  isDisabling?: boolean;
  userRole?: "USER" | "ADMIN" | "INSTRUCTOR";
  isDisabled?: boolean;
}

export default function ReviewItem({
  review,
  isOwner,
  onEdit,
  onDelete,
  onDisable,
  isDeleting,
  isDisabling = false,
  userRole = "USER",
  isDisabled = false,
}: ReviewItemProps) {
  const [showMenu, setShowMenu] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  // Determine if user can perform actions
  const canEdit = userRole === "USER" && isOwner;
  const canDelete = userRole === "USER" && isOwner; // Only creator can delete
  const canDisable = userRole === "ADMIN" && onDisable;
  const showActions = canEdit || canDelete || canDisable;

  return (
    <div className={`relative ${isDisabled ? 'opacity-60' : ''}`}>
      {/* User Info and Rating */}
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg- rounded-full flex items-center justify-center">
            <span className=" font-semibold text-sm">
              {review.user?.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
        </div>

        {/* Review Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-semibold ">
                  {review.user?.name || "Anonymous"}
                </h4>
                <div className="flex items-center space-x-1">
                  {renderStars(review.rating)}
                </div>
              </div>
              
              {review.title && (
                <h5 className="text-sm font-medium  mt-1">
                  {review.title}
                </h5>
              )}
              
              {review.comment && (
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 leading-relaxed">
                  {review.comment}
                </p>
              )}
              
              <p className="text-xs text-gray-500 mt-2 dark:text-gray-300">
                {formatDate(review.createdAt)}
              </p>
            </div>

            {/* Actions Menu */}
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 text-gray-500 hover:text-blue-700 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 dark:bg-black">
                  {canEdit && (
                    <DropdownMenuItem
                      onClick={() => onEdit()}
                      className=" flex items-center space-x-2"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                  )}
                  {canDisable && (
                    <DropdownMenuItem
                      onClick={onDisable}
                      disabled={isDisabling}
                      className="text-yellow-600 hover:bg-yellow-100 flex items-center space-x-2 disabled:opacity-50"
                    >
                      {isDisabled ? (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          <span>{isDisabling ? "Enabling..." : "Enable"}</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-4 h-4 mr-2" />
                          <span>{isDisabling ? "Disabling..." : "Disable"}</span>
                        </>
                      )}
                    </DropdownMenuItem>
                  )}
                  {canDelete && (
                    <DropdownMenuItem
                      onClick={onDelete}
                      disabled={isDeleting}
                      className=" flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
} 