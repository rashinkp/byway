"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  GraduationCap,
  BookOpen,
  Users,
  Star,
  DollarSign,
  TrendingUp,
  Mail,
  CheckCircle,
  XCircle,
  Award,
} from "lucide-react";

interface TopInstructor {
  id: string;
  name: string;
  email: string;
  avatar: string;
  courseCount: number;
  totalEnrollments: number;
  totalRevenue: number;
  averageRating: number;
  isActive: boolean;
  sellingRate: number; // Percentage of courses sold
  totalCourses: number;
}

interface TopInstructorsListProps {
  title: string;
  subtitle: string;
  instructors: TopInstructor[];
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBgColor: string;
}

export default function TopInstructorsList({
  title,
  subtitle,
  instructors,
  icon: Icon,
  iconColor,
  iconBgColor,
}: TopInstructorsListProps) {
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
        {instructors.map((instructor, index) => (
          <div
            key={instructor.id}
            className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4 hover:bg-white/80 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              {/* Left side - Instructor Info */}
              <div className="flex items-center space-x-4 flex-1">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                </div>

                {/* Instructor Avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <img
                    src={instructor.avatar}
                    alt={instructor.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/48x48/8B5CF6/FFFFFF?text=IN";
                    }}
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                      #{index + 1}
                    </Badge>
                    <h4 className="font-semibold text-gray-900">
                      {instructor.name}
                    </h4>
                    <Badge
                      variant="outline"
                      className={
                        instructor.isActive
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }
                    >
                      {instructor.isActive ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {instructor.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      <Award className="w-3 h-3 mr-1" />
                      {instructor.sellingRate}% Sell Rate
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-blue-500" />
                      <div>
                        <span className="text-gray-600">Email:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {instructor.email}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <div>
                        <span className="text-gray-600">Courses:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {instructor.courseCount}/{instructor.totalCourses}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-green-500" />
                      <div>
                        <span className="text-gray-600">Enrollments:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {instructor.totalEnrollments}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <div>
                        <span className="text-gray-600">Rating:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {instructor.averageRating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <div>
                        <span className="text-gray-600">Revenue:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {formatCurrency(instructor.totalRevenue)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-purple-500" />
                      <div>
                        <span className="text-gray-600">Performance:</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {instructor.sellingRate >= 80 ? "Excellent" : 
                           instructor.sellingRate >= 60 ? "Good" : 
                           instructor.sellingRate >= 40 ? "Average" : "Poor"}
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