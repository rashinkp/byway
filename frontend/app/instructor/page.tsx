"use client";

import { useInstructorDashboard } from "@/hooks/instructor/useInstructorDashboard";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { StatCard } from "@/components/dashboard/StatCard";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  UserCheck,
  UserX,
  BarChart3,
  GraduationCap,
  Star,
  MessageSquare,
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

export default function InstructorDashboard() {
  const { data, isLoading, error } = useInstructorDashboard();
  const router = useRouter();

  const handleCourseClick = (courseId: string) => {
    router.push(`/instructor/courses/${courseId}`);
  };

  return (
    <DashboardLayout
      title="Instructor Dashboard"
      subtitle="Your course performance and student analytics"
      isLoading={isLoading}
      error={error}
      data={data}
    >
      {data && (
        <>
          {/* Statistics Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Courses */}
            <StatCard
              icon={BookOpen}
              iconColor="text-blue-600"
              title="Total Courses"
              value={data.stats.totalCourses}
              badges={[
                {
                  label: `${data.stats.activeCourses} Active`,
                  variant: "outline",
                  icon: CheckCircle,
                },
                {
                  label: `${data.stats.pendingCourses} Pending`,
                  variant: "secondary",
                  icon: Clock,
                },
              ]}
            />

            {/* Total Students */}
            <StatCard
              icon={Users}
              iconColor="text-green-600"
              title="Total Students"
              value={data.stats.totalStudents}
              badges={[
                {
                  label: `${data.stats.totalEnrollments} Enrollments`,
                  variant: "outline",
                  icon: UserCheck,
                },
              ]}
            />

            {/* Total Revenue */}
            <StatCard
              icon={DollarSign}
              iconColor="text-yellow-600"
              title="Total Revenue"
              value={`$${truncateToTwoDecimals(data.stats.totalRevenue)}`}
              badges={[
                {
                  label: "Revenue",
                  variant: "default",
                  icon: TrendingUp,
                },
              ]}
            />

            {/* Average Rating */}
            <StatCard
              icon={Star}
              iconColor="text-purple-600"
              title="Average Rating"
              value={`${truncateToTwoDecimals(data.stats.averageRating)}/5`}
              badges={[
                {
                  label: `${data.stats.totalReviews} Reviews`,
                  variant: "outline",
                  icon: MessageSquare,
                },
              ]}
            />
      </div>

          {/* Course Status Stats */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={CheckCircle}
              iconColor="text-green-600"
              title="Active Courses"
              value={data.stats.activeCourses}
              className="md:col-span-1"
            />
            <StatCard
              icon={Clock}
              iconColor="text-yellow-600"
              title="Pending Courses"
              value={data.stats.pendingCourses}
              className="md:col-span-1"
            />
            <StatCard
              icon={AlertCircle}
              iconColor="text-gray-600"
              title="Completed Courses"
              value={data.stats.completedCourses}
              className="md:col-span-1"
            />
          </div> */}

          {/* Top Courses Section */}
          <DashboardSection
            icon={TrendingUp}
            iconColor="text-blue-600"
            iconBgColor="bg-blue-50"
            title="Top Performing Courses"
            subtitle="Your courses with highest enrollment and revenue"
          >
            <div className="space-y-4">
              {data.topCourses.map((course, index) => (
                <div key={course.courseId} className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">#{index + 1}</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        <button
                          onClick={() => handleCourseClick(course.courseId)}
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600 hover:underline transition-colors cursor-pointer"
                        >
                          {course.courseTitle}
                        </button>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          course.status === 'PUBLISHED' ? 'bg-green-50 text-green-700 border border-green-200' :
                          course.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                          'bg-gray-50 text-gray-700 border border-gray-200'
                        }`}>
                          {course.status}
                        </span>
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
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Reviews</p>
                            <p className="text-sm font-medium">{course.reviewCount}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Created</p>
                            <p className="text-sm font-medium">{new Date(course.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardSection>

          {/* Recent Students Section */}
          <DashboardSection
            icon={Users}
            iconColor="text-green-600"
            iconBgColor="bg-green-50"
            title="Recent Students"
            subtitle="Students who recently enrolled in your courses"
          >
            <div className="space-y-4">
              {data.recentStudents.map((student) => (
                <div key={student.studentId} className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-600">
                        {student.studentName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">{student.studentName}</h3>
                        <span className="text-sm text-gray-500">{student.email}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          student.isActive 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {student.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <BookOpen className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Enrolled Courses</p>
                            <p className="text-sm font-medium">{student.enrolledCourses}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Last Enrollment</p>
                            <p className="text-sm font-medium">{new Date(student.lastEnrollmentDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DashboardSection>

          {/* Recent Enrollments Section */}
          <DashboardSection
            icon={GraduationCap}
            iconColor="text-purple-600"
            iconBgColor="bg-purple-50"
            title="Recent Enrollments"
            subtitle="Latest student enrollments in your courses"
          >
            <div className="space-y-4">
              {data.recentEnrollments.map((enrollment, index) => (
                <div key={`${enrollment.courseId}-${enrollment.studentName}-${index}`} className="bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-semibold text-purple-600">#{index + 1}</span>
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">{enrollment.courseTitle}</h3>
                        <span className="text-sm text-gray-500">by {enrollment.studentName}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Enrolled At</p>
                            <p className="text-sm font-medium">{new Date(enrollment.enrolledAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
      </div>
    </div>
              ))}
            </div>
          </DashboardSection>
        </>
      )}
    </DashboardLayout>
  );
}
