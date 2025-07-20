import { useState } from "react";
import { Course } from "@/types/course";
import { useAuth } from "@/hooks/auth/useAuth";
import { useGetCourseReviews } from "@/hooks/course-review/useGetCourseReviews";
import AddReviewForm from "./AddReviewForm";
import ReviewList from "./ReviewList";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const isEnrolled = course?.isEnrolled || false;
  const canReview = user && isEnrolled && userRole === "USER";

  // Use review stats from course data if available
  const reviewStats = course?.reviewStats;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? " fill-current" : ""
        }`}
      />
    ));
  };

  // For instructors, show a simplified view
  if (userRole === 'INSTRUCTOR') {
    return (
      <div className="space-y-6">
        {/* Review Stats for Instructor */}
        {reviewStats && reviewStats.totalReviews > 0 && (
          <div className="bg-white dark:bg-[#232323] rounded-lg p-6">
            <h3 className="text-sm font-semibold text-black dark:text-[#facc15] mb-4">Review Statistics</h3>
            <div className="flex items-start space-x-6">
              {/* Average Rating */}
              <div className="text-center">
                <div className="text-3xl font-bold ">
                  {reviewStats.averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mt-1">
                  {renderStars(Math.round(reviewStats.averageRating))}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                  {reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? 'review' : 'reviews'}
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 w-8">
                      <span className="text-sm text-gray-500 dark:text-gray-300">{rating}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-[#f9fafb] dark:bg-[#18181b] rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${reviewStats.ratingPercentages?.[rating] ?? 0}%` }}
                      />
                    </div>
                    <div className="w-8 text-sm text-gray-500 dark:text-gray-300 text-right">
                      {reviewStats.ratingDistribution?.[rating] ?? 0}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-black dark:text-[#facc15]">
              Student Reviews
            </h3>
            
            {reviewsData?.total && (
              <span className="text-xs text-gray-500 dark:text-gray-300">
                {reviewsData.total} {reviewsData.total === 1 ? 'review' : 'reviews'}
              </span>
            )}
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

  return (
    <div className="space-y-8">
      {/* Add Review Button - Only for users */}
      {canReview && !showAddReview && (
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setShowAddReview(true)}
            className="px-4 py-2 bg-[#facc15] text-black rounded-lg hover:bg-[#18181b] hover:text-[#facc15] transition-colors font-medium shadow"
          >
            Add Review
          </button>
        </div>
      )}
      {/* Add Review Form */}
      {canReview && showAddReview && (
        <div className="rounded-lg p-6 bg-[#f9fafb] dark:bg-[#18181b] mb-4">
          <AddReviewForm
            courseId={course?.id || ""}
            onSuccess={() => setShowAddReview(false)}
            onCancel={() => setShowAddReview(false)}
          />
        </div>
      )}

      {/* Reviews Card */}
      <div className="rounded-xl  space-y-6">
        {/* Review Stats for Instructor or User */}
        {reviewStats && reviewStats.totalReviews > 0 && (
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-black dark:text-[#facc15]">
                  {reviewStats.averageRating.toFixed(1)}
                </div>
                <div className="flex gap-1">
                  {renderStars(Math.round(reviewStats.averageRating))}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  ({reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? 'review' : 'reviews'})
                </div>
              </div>
              {/* Rating Distribution (Instructor only) - already handled in instructor block above */}
            </div>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black dark:text-[#facc15]">
            {userRole === "USER" ? "Student Reviews" : "Course Reviews"}
          </h3>
          <div className="flex gap-2">
            {userRole !== "ADMIN" && (
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-[#facc15]/10 text-[#facc15]'
                    : 'bg-[#f9fafb] dark:bg-[#18181b] text-gray-500 dark:text-gray-300 hover:bg-[#facc15]/10'
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
                    ? 'bg-[#facc15]/10 text-[#facc15]'
                    : 'bg-[#f9fafb] dark:bg-[#18181b] text-gray-500 dark:text-gray-300 hover:bg-[#facc15]/10'
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
                      ? 'bg-[#facc15]/10 text-[#facc15]'
                      : 'bg-[#f9fafb] dark:bg-[#18181b] text-gray-500 dark:text-gray-300 hover:bg-[#facc15]/10'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setDisabledFilter('disabled')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    disabledFilter === 'disabled'
                      ? 'bg-yellow-400 text-black'
                      : 'bg-[#f9fafb] dark:bg-[#18181b] text-gray-500 dark:text-gray-300 hover:bg-yellow-400 hover:text-black'
                  }`}
                >
                  Disabled
                </button>
              </>
            )}
          </div>
        </div>

        {/* Reviews List */}
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