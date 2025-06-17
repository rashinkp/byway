import { useState } from "react";
import { Course } from "@/types/course";
import { useAuth } from "@/hooks/auth/useAuth";
import { useGetCourseReviews } from "@/hooks/course-review/useGetCourseReviews";
import ReviewStats from "./ReviewStats";
import AddReviewForm from "./AddReviewForm";
import ReviewList from "./ReviewList";
import ReviewListSkeleton from "./ReviewListSkeleton";

interface CourseReviewsProps {
  course: Course | undefined;
  isLoading: boolean;
  userRole?: "USER" | "ADMIN" | "INSTRUCTOR";
}

export default function CourseReviews({
  course,
  isLoading,
  userRole = "USER",
}: CourseReviewsProps) {
  const { user } = useAuth();
  const [showAddReview, setShowAddReview] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'my'>('all');
  const [disabledFilter, setDisabledFilter] = useState<'all' | 'disabled'>('all');

  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    error: reviewsError,
  } = useGetCourseReviews(course?.id || "", {
    page: 1,
    limit: 10,
    isMyReviews: user && userRole === "USER" ? activeFilter === 'my' : false,
    includeDisabled: userRole === "ADMIN",
  });

  if (isLoading) {
    return <ReviewListSkeleton />;
  }

  const isEnrolled = course?.isEnrolled || false;
  const canReview = user && isEnrolled && userRole === "USER";

  // Use review stats from course data if available
  const reviewStats = course?.reviewStats;

  return (
    <div className="space-y-8">
      {/* Add Review Section - Only for users */}
      {canReview && (
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Write a Review</h3>
            {!showAddReview && (
              <button
                onClick={() => setShowAddReview(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Review
              </button>
            )}
          </div>
          
          {showAddReview && (
            <AddReviewForm
              courseId={course?.id || ""}
              onSuccess={() => setShowAddReview(false)}
              onCancel={() => setShowAddReview(false)}
            />
          )}
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {userRole === "USER" ? "Student Reviews" : "Course Reviews"}
          </h3>
          
          {/* Filter Buttons */}
          <div className="flex space-x-2">
            {userRole !== "ADMIN" && (
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Reviews
              </button>
            )}
            {user && userRole === "USER" && (
              <button
                onClick={() => setActiveFilter('my')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'my'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                My Reviews
              </button>
            )}
            
            {/* Admin Filter Buttons */}
            {userRole === "ADMIN" && (
              <>
                <button
                  onClick={() => setDisabledFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    disabledFilter === 'all'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setDisabledFilter('disabled')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    disabledFilter === 'disabled'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Disabled
                </button>
              </>
            )}
          </div>
        </div>

        <ReviewList
          reviews={reviewsData?.items || []}
          isLoading={reviewsLoading}
          error={reviewsError}
          total={reviewsData?.total || 0}
          courseId={course?.id || ""}
          activeFilter={activeFilter}
          userRole={userRole}
          disabledFilter={disabledFilter}
        />
      </div>
    </div>
  );
} 