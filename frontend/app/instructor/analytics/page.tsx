"use client";

import { Loader2 } from "lucide-react";
import {
  useOverallRevenue,
  useCourseRevenue,
  useLatestRevenue,
} from "@/hooks/revenue/useRevenueAnalytics";
import { format } from "date-fns";
import {
  AnalyticsHeader,
  RevenueOverviewCards,
  LatestRevenueList,
} from "@/components/analytics";
import { useAnalyticsState } from "@/hooks/analytics/useAnalyticsState";

export default function InstructorAnalytics() {
  const {
    dateRange,
    searchInput,
    latestRevenueParams,
    handleSearchInputChange,
    handleSort,
    handlePageChange,
    handleDateChange,
  } = useAnalyticsState();

  const { data: overallData, isLoading: isLoadingOverall } = useOverallRevenue({
    startDate: dateRange.from
      ? format(dateRange.from, "yyyy-MM-dd")
      : format(new Date().setFullYear(new Date().getFullYear() - 1), "yyyy-MM-dd"),
    endDate: dateRange.to
      ? format(dateRange.to, "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd"),
  });

  const { data: courseData, isLoading: isLoadingCourses } = useCourseRevenue({
    startDate: dateRange.from
      ? format(dateRange.from, "yyyy-MM-dd")
      : format(new Date().setFullYear(new Date().getFullYear() - 1), "yyyy-MM-dd"),
    endDate: dateRange.to
      ? format(dateRange.to, "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd"),
    sortBy: "revenue",
    sortOrder: "desc",
  });

  const { data: latestData, isLoading: isLoadingLatest } =
    useLatestRevenue({
      ...latestRevenueParams,
      startDate: dateRange.from
        ? format(dateRange.from, "yyyy-MM-dd")
        : format(new Date().setFullYear(new Date().getFullYear() - 1), "yyyy-MM-dd"),
      endDate: dateRange.to
        ? format(dateRange.to, "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd"),
    });

  const isLoading = isLoadingOverall || isLoadingCourses || isLoadingLatest;

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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <AnalyticsHeader
          title="Instructor Analytics Dashboard"
          subtitle="Track your course performance and earnings insights"
          dateRange={dateRange}
          onDateChange={handleDateChange}
        />

        {/* Revenue Overview Cards */}
        <RevenueOverviewCards
          overallData={overallData}
          dateRange={dateRange}
        />

        {/* Latest Revenue Transactions */}
        <LatestRevenueList
          latestData={latestData}
          isLoading={isLoadingLatest}
          onSearchChange={handleSearchInputChange}
          onSortChange={handleSort}
          onPageChange={handlePageChange}
          currentSort={latestRevenueParams.sortBy}
          currentPage={latestData?.data?.page || 1}
          searchValue={searchInput}
        />
      </div>
    </div>
  );
} 