"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  BookOpen,
  User,
  Loader2
} from "lucide-react";
import { useOverallRevenue, useCourseRevenue } from "@/hooks/useRevenueAnalytics";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { useState } from "react";

// Dummy data for future features
const dummyInstructorRevenues = [
  {
    instructorId: "1",
    instructorName: "John Doe",
    courseCount: 3,
    totalRevenue: 15000,
    netRevenue: 10500,
  },
  {
    instructorId: "2",
    instructorName: "Jane Smith",
    courseCount: 2,
    totalRevenue: 12000,
    netRevenue: 8400,
  },
];

export default function RevenueAnalytics() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const { data: overallData, isLoading: isLoadingOverall } = useOverallRevenue({
    startDate: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : format(endOfMonth(new Date()), 'yyyy-MM-dd'),
  });

  const { data: courseData, isLoading: isLoadingCourses } = useCourseRevenue({
    startDate: dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    endDate: dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    sortBy: 'revenue',
    sortOrder: 'desc',
  });

  const isLoading = isLoadingOverall || isLoadingCourses;

  const formatCurrency = (amount: number) => {
    if (typeof amount !== 'number' || isNaN(amount)) return '$0.00';
    // Use Math.floor to truncate to 2 decimal places without rounding
    const truncatedAmount = Math.floor(amount * 100) / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true
    }).format(truncatedAmount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!overallData || !courseData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">No revenue data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-gray-900">Revenue Analytics</h1>
              <div className="flex items-center gap-4">
                <DatePickerWithRange 
                  date={dateRange}
                  onDateChange={(date) => date && setDateRange(date)}
                />
                <Badge 
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Live Data
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Revenue Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-1">
                  {formatCurrency(overallData?.data?.totalRevenue)}
                </h3>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span className="text-sm">Net: {formatCurrency(overallData?.data?.netRevenue)}</span>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Refunded Amount</p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-1">
                  {formatCurrency(overallData?.data?.refundedAmount)}
                </h3>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <ArrowDownRight className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">
                Net after refunds: {formatCurrency(overallData?.data?.netRevenue)}
              </span>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Selected Period</p>
                <h3 className="text-2xl font-semibold text-gray-900 mt-1">
                  {dateRange.from ? format(dateRange.from, 'MMM d, yyyy') : 'Select date'}
                </h3>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">
                To: {dateRange.to ? format(dateRange.to, 'MMM d, yyyy') : 'Select date'}
              </span>
            </div>
          </Card>
        </div>

        {/* Course Revenues List */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-2 text-gray-900 mb-6">
              <BookOpen className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Course Revenues</h2>
            </div>
            <div className="space-y-4">
              {(courseData?.data?.courses || []).map((course) => (
                <div key={course.courseId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{course.title}</h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-1" />
                        {course.enrollments} enrollments
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(course.totalRevenue)}</p>
                    <p className="text-sm text-gray-500">Net: {formatCurrency(course.netRevenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Instructor Revenues List - Using dummy data for now */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-2 text-gray-900 mb-6">
              <User className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Instructor Revenues</h2>
            </div>
            <div className="space-y-4">
              {dummyInstructorRevenues.map((instructor) => (
                <div key={instructor.instructorId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-50 p-2 rounded-lg">
                      <User className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{instructor.instructorName}</h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {instructor.courseCount} courses
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(instructor.totalRevenue)}</p>
                    <p className="text-sm text-gray-500">Net: {formatCurrency(instructor.netRevenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

