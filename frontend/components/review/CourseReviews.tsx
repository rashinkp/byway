import { useState } from "react";
import { Course } from "@/types/course";
import { useAuth } from "@/hooks/auth/useAuth";
import { useGetCourseReviews } from "@/hooks/course-review/useGetCourseReviews";
import ReviewStats from "./ReviewStats";
import AddReviewForm from "./AddReviewForm";
import ReviewList from "./ReviewList";
import ReviewListSkeleton from "./ReviewListSkeleton";
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
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  // For instructors, show a simplified view
  if (userRole === "INSTRUCTOR") {
    return (
      <div className="space-y-6">
        {/* Review Stats for Instructor */}
        {reviewStats && reviewStats.totalReviews > 0 && (
          <div className="bg-gray-50/50 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Review Statistics</h3>
            <div className="flex items-start space-x-6">
              {/* Average Rating */}
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {reviewStats.averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mt-1">
                  {renderStars(Math.round(reviewStats.averageRating))}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {reviewStats.totalReviews} {reviewStats.totalReviews === 1 ? 'review' : 'reviews'}
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 w-8">
                      <span className="text-sm text-gray-600">{rating}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${reviewStats.ratingPercentages?.[rating] ?? 0}%` }}
                      />
                    </div>
                    <div className="w-8 text-sm text-gray-600 text-right">
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
            <h3 className="text-sm font-semibold text-gray-900">
              Student Reviews
            </h3>
            
            {reviewsData?.total && (
              <span className="text-xs text-gray-500">
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