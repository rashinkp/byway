import React from "react";
import { generateAdminDashboardReport } from "@/lib/generateAdminDashboardReport";
import { Button } from "../ui/button";

interface PDFExportButtonProps {
  dashboardData?: any; // Use the DashboardData type if available
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