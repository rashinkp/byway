import { useState } from "react";
import { Course } from "@/types/course";
import { useAuth } from "@/hooks/auth/useAuth";
import { useGetCourseReviews } from "@/hooks/course-review/useGetCourseReviews";
import AddReviewForm from "./AddReviewForm";
import ReviewList from "./ReviewList";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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
  const [disabledFilter] = useState<'all' | 'disabled'>('all');

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

  const userHasReview = !!(user && reviewsData?.items?.some(r => r.userId === user.id));

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
            <h3 className="text-sm font-semibold text-black dark:text-white mb-4">Review Statistics</h3>
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
            <h3 className="text-sm font-semibold text-black dark:text-white">
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
      {canReview && (
        <>
          <div className="flex justify-end mb-2">
            <Button
              onClick={() => setShowAddReview(true)}
              className=""
              disabled={userHasReview}
              title={userHasReview ? 'You have already reviewed this course.' : ''}
            >
              Add Review
            </Button>
          </div>
          <Dialog open={showAddReview} onOpenChange={setShowAddReview}>
            <DialogContent className="max-w-lg p-0 border-none">
              <VisuallyHidden>
                <DialogTitle>Add Review</DialogTitle>
              </VisuallyHidden>
              <AddReviewForm
                courseId={course?.id || ""}
                onSuccess={() => setShowAddReview(false)}
                onCancel={() => setShowAddReview(false)}
              />
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* Reviews Card */}
      <div className="rounded-xl  space-y-6">
        {/* Review Stats for Instructor or User */}
        {reviewStats && reviewStats.totalReviews > 0 && (
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold text-black dark:text-white">
                  {reviewStats.averageRating.toFixed(1)}
                </div>
                <div className="flex gap-1 text-[#facc15]">
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

        {/* Filter Toggle - Segmented Control Style */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex bg-gray-100 dark:bg-[#232323] rounded-lg p-1 gap-1">
            <Button
              variant={activeFilter === 'all' ? 'primary' : 'ghost'}
              size="sm"
              className={`rounded-lg px-4 py-1 text-sm font-medium transition-all duration-150 `}
              onClick={() => setActiveFilter('all')}
            >
              All Reviews
            </Button>
            <Button
              variant={activeFilter === 'my' ? 'primary' : 'ghost'}
              size="sm"
              className={`rounded-lg px-4 py-1 text-sm font-medium transition-all duration-150 hover:none`}
              onClick={() => setActiveFilter('my')}
            >
              My Reviews
            </Button>
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