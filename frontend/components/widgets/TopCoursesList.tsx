"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Users,
  Star,
  DollarSign,
  TrendingUp,
  User,
} from "lucide-react";

interface TopCourse {
  id: string;
  title: string;
  thumbnail: string;
  creatorName: string;
  enrollmentCount: number;
  revenue: number;
  rating: number;
  reviewCount: number;
  price: number;
  category: string;
}

interface TopCoursesListProps {
  title: string;
  subtitle: string;
  courses: TopCourse[];
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBgColor: string;
}

export default function TopCoursesList({
  title,
  subtitle,
  courses,
  icon: Icon,
  iconColor,
  iconBgColor,
}: TopCoursesListProps) {
  const formatCurrency = (amount: number) => {
    if (typeof amount !== "number" || isNaN(amount)) return "$0.00";
    const truncatedAmount = Math.floor(amount * 100) / 100;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    }).format(truncatedAmount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${iconBgColor}`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          <p className="text-sm text-gray-600">
            {subtitle}
          </p>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        {courses.map((course, index) => (
          <div
            key={course.id}
            className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 hover:bg-white/80 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              {/* Left side - Course Info */}
              <div className="flex items-center space-x-4 flex-1">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>

                {/* Course Thumbnail */}
                <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/64x48/3B82F6/FFFFFF?text=Course";
                    }}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                      #{index + 1}
                    </Badge>
                    <h4 className="font-semibold text-gray-900">
                      {course.title}
                    </h4>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {course.category}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-purple-500" />
                      <div>
                        <span className="text-gray-600">Creator:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {course.creatorName}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-green-500" />
                      <div>
                        <span className="text-gray-600">Enrollments:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {course.enrollmentCount}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <div>
                        <span className="text-gray-600">Rating:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {course.rating.toFixed(1)} ({course.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <div>
                        <span className="text-gray-600">Revenue:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {formatCurrency(course.revenue)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-blue-500" />
                      <div>
                        <span className="text-gray-600">Price:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {formatCurrency(course.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 