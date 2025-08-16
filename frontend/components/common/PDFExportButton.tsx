import React from "react";
import { generateAdminDashboardReport } from "@/lib/generateAdminDashboardReport";
import { Button } from "../ui/button";

type DashboardData = {
  stats: {
    courseStats: {
      totalCourses: number;
      activeCourses: number;
      pendingCourses: number;
    };
    userStats: {
      totalInstructors: number;
      activeInstructors: number;
      inactiveInstructors: number;
      totalUsers: number;
      activeUsers: number;
      inactiveUsers: number;
    };
    totalRevenue: number;
    enrollmentStats: {
      totalEnrollments: number;
    };
  };
  topEnrolledCourses: Array<{
    courseId: string;
    courseTitle: string;
    instructorName: string;
    enrollmentCount: number;
    revenue: number;
    rating: number;
    reviewCount: number;
  }>;
  topInstructors: Array<{
    instructorId: string;
    instructorName: string;
    email: string;
    isActive: boolean;
    courseCount: number;
    totalEnrollments: number;
    totalRevenue: number;
    averageRating: number;
  }>;
};

interface PDFExportButtonProps {
  dashboardData?: DashboardData;
  onExport?: () => void;
  className?: string;
}

const PDFExportButton: React.FC<PDFExportButtonProps> = ({ dashboardData, onExport }) => {
  const handleExportPDF = () => {
    if (onExport) {
      onExport();
    } else if (dashboardData) {
      generateAdminDashboardReport(dashboardData);
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