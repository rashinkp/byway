import React from "react";
import { generateAdminDashboardReport } from "@/lib/generateAdminDashboardReport";
import { Button } from "../ui/button";
import { DashboardResponse } from "@/types/dashboard";

type DashboardData = {
  stats: {
    totalUsers: number;
    totalCourses: number;
    totalInstructors: number;
    totalRevenue: number;
    activeUsers: number;
    pendingApprovals: number;
  };
  topInstructors: Array<{
    instructorName: string;
    email: string;
    courseCount: number;
    totalEnrollments: number;
    totalRevenue: number;
    averageRating: number;
  }>;
  recentActivity: Array<{
    type: string;
    description: string;
    userName?: string;
    createdAt: string;
    status: string;
  }>;
};

interface PDFExportButtonProps {
  dashboardData?: DashboardResponse;
  onExport?: () => void;
  className?: string;
}

const PDFExportButton: React.FC<PDFExportButtonProps> = ({ dashboardData, onExport }) => {
  const handleExportPDF = () => {
    if (onExport) {
      onExport();
    } else if (dashboardData) {
      // Transform DashboardResponse to DashboardData
      const transformedData: DashboardData = {
        stats: {
          totalUsers: dashboardData.stats.userStats.totalUsers,
          totalCourses: dashboardData.stats.courseStats.totalCourses,
          totalInstructors: dashboardData.stats.userStats.totalInstructors,
          totalRevenue: dashboardData.stats.totalRevenue,
          activeUsers: dashboardData.stats.userStats.activeUsers,
          pendingApprovals: dashboardData.stats.courseStats.pendingCourses
        },
        topInstructors: dashboardData.topInstructors.map(instructor => ({
          instructorName: instructor.instructorName,
          email: instructor.email,
          courseCount: instructor.courseCount,
          totalEnrollments: instructor.totalEnrollments,
          totalRevenue: instructor.totalRevenue,
          averageRating: instructor.averageRating
        })),
        recentActivity: dashboardData.recentActivity
      };
      generateAdminDashboardReport(transformedData);
    }
  };

  return (
    <Button
      variant={'primary'}
      onClick={handleExportPDF}
    >
      Export as PDF
    </Button>
  );
};

export default PDFExportButton; 