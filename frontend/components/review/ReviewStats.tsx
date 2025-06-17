import { Star } from "lucide-react";
import { CourseReviewStats } from "@/types/course";

interface ReviewStatsProps {
  stats: CourseReviewStats | undefined;
  isLoading: boolean;
  totalReviews: number;
}

export default function ReviewStats({
  stats,
  isLoading,
  totalReviews,
}: ReviewStatsProps) {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="flex-1 space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="h-4 bg-gray-200 rounded w-8"></div>
                <div className="h-2 bg-gray-200 rounded flex-1"></div>
                <div className="h-4 bg-gray-200 rounded w-8"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <p className="text-gray-500 text-center">No reviews yet</p>
      </div>
    );
  }

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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center space-x-6">
        {/* Average Rating */}
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">
            {stats.averageRating.toFixed(1)}
          </div>
          <div className="flex justify-center mt-1">
            {renderStars(Math.round(stats.averageRating))}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
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
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${stats.ratingPercentages?.[rating] ?? 0}%` }}
                ></div>
              </div>
              <div className="w-8 text-sm text-gray-600 text-right">
                {stats.ratingDistribution?.[rating] ?? 0}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 