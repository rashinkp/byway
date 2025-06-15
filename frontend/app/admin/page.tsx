"use client";

import { useAdminDashboard } from "@/hooks/admin/useAdminDashboard";
import {
  BookOpen,
  GraduationCap,
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  UserCheck,
  UserX,
  Activity,
  BarChart3,
} from "lucide-react";

// Function to truncate to 2 decimal places without rounding
const truncateToTwoDecimals = (num: number): string => {
  const str = num.toString();
  const decimalIndex = str.indexOf('.');
  if (decimalIndex === -1) {
    return str + '.00';
  }
  const truncated = str.substring(0, decimalIndex + 3); // Include 2 decimal places
  return truncated.padEnd(decimalIndex + 3, '0'); // Pad with zeros if needed
};

export default function AdminDashboard() {
  const { data, isLoading, error } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 h-32 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-16 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h2 className="text-red-800 font-semibold">Error Loading Dashboard</h2>
            <p className="text-red-600">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h2 className="text-yellow-800 font-semibold">No Data Available</h2>
            <p className="text-yellow-600">Dashboard data is not available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  const { stats, topEnrolledCourses, topInstructors } = data;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Comprehensive overview of platform performance and analytics</p>
          </div>
          <div className="ml-auto">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
              <Activity className="w-4 h-4" />
              Live Data
            </span>
          </div>
        </div>

        {/* Statistics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Courses Stats */}
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-gray-600">Total Courses</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.courseStats.totalCourses}</div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                    <CheckCircle className="w-3 h-3" />
                    {stats.courseStats.activeCourses} Active
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                    <AlertCircle className="w-3 h-3" />
                    {stats.courseStats.pendingCourses} Pending
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Instructors Stats */}
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-600">Instructors</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.userStats.totalInstructors}</div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                    <CheckCircle className="w-3 h-3" />
                    {stats.userStats.activeInstructors} Active
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                    <UserX className="w-3 h-3" />
                    {stats.userStats.inactiveInstructors} Inactive
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Users Stats */}
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-600">Total Users</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.userStats.totalUsers}</div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                    <UserCheck className="w-3 h-3" />
                    {stats.userStats.activeUsers} Active
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                    <UserX className="w-3 h-3" />
                    {stats.userStats.inactiveUsers} Inactive
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Stats */}
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-600">Total Revenue</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">${truncateToTwoDecimals(stats.totalRevenue)}</div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    <TrendingUp className="w-3 h-3" />
                    Revenue
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enrollments Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm font-medium text-gray-600">Total Enrollments</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stats.enrollmentStats.totalEnrollments}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Enrolled Courses Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Top Enrolled Courses</h2>
              <p className="text-gray-600">Most popular courses by enrollment count and revenue</p>
            </div>
          </div>
          <div className="space-y-4">
            {topEnrolledCourses.map((course, index) => (
              <div key={course.courseId} className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <h3 className="text-lg font-semibold text-gray-900">{course.courseTitle}</h3>
                      <span className="text-sm text-gray-500">by {course.instructorName}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Enrollments</p>
                          <p className="text-sm font-medium">{course.enrollmentCount}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Revenue</p>
                          <p className="text-sm font-medium">${truncateToTwoDecimals(course.revenue)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Rating</p>
                          <p className="text-sm font-medium">{course.rating}/5</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Reviews</p>
                          <p className="text-sm font-medium">{course.reviewCount}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Instructors Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Top Performing Instructors</h2>
              <p className="text-gray-600">Instructors with highest selling rates and revenue</p>
            </div>
          </div>
          <div className="space-y-4">
            {topInstructors.map((instructor, index) => (
              <div key={instructor.instructorId} className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-semibold text-purple-600">#{index + 1}</span>
                  </div>
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-600">
                      {instructor.instructorName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <h3 className="text-lg font-semibold text-gray-900">{instructor.instructorName}</h3>
                      <span className="text-sm text-gray-500">{instructor.email}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        instructor.isActive 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {instructor.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Courses</p>
                          <p className="text-sm font-medium">{instructor.courseCount}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Enrollments</p>
                          <p className="text-sm font-medium">{instructor.totalEnrollments}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Revenue</p>
                          <p className="text-sm font-medium">${truncateToTwoDecimals(instructor.totalRevenue)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Rating</p>
                          <p className="text-sm font-medium">{truncateToTwoDecimals(instructor.averageRating)}/5</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
