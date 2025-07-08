import React from "react";
import { generateAdminDashboardReport } from "@/lib/generateAdminDashboardReport";

interface PDFExportButtonProps {
  dashboardData?: any; // Use the DashboardData type if available
  onExport?: () => void;
  className?: string;
}

const PDFExportButton: React.FC<PDFExportButtonProps> = ({ dashboardData, onExport, className }) => {
  const handleExportPDF = () => {
    if (onExport) {
      onExport();
    } else if (dashboardData) {
      generateAdminDashboardReport(dashboardData);
    }
  };

  return (
    <button
      onClick={handleExportPDF}
      className={className || "px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors font-semibold"}
    >
      Export as PDF
    </button>
  );
};

export default PDFExportButton; 