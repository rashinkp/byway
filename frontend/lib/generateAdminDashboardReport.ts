import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AdminDashboardResponse } from "@/types/analytics";
import { format } from "date-fns";

// Extend jsPDF interface to include autoTable properties
interface jsPDFWithAutoTable extends jsPDF {
	lastAutoTable?: {
		finalY: number;
	};
}

export function generateAdminDashboardReport(data: AdminDashboardResponse) {
  const doc = new jsPDF({ orientation: "landscape" }) as jsPDFWithAutoTable;
  let y = 20;

  // Platform/Report Introduction
  doc.setFontSize(20);
  doc.setTextColor(41, 128, 185);
  doc.text("Byway E-Learning Platform", 14, y);
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  y += 10;
  doc.text(
    "Admin Dashboard Report: This report provides a comprehensive overview of platform performance, user statistics, and system health metrics.",
    14,
    y + 8,
    { maxWidth: 270 }
  );
  y += 25;

  // Platform Statistics Overview
  doc.setFontSize(16);
  doc.setTextColor(123, 36, 160);
  doc.text("Platform Statistics Overview", 14, y);
  y += 8;
  autoTable(doc, {
    startY: y,
    head: [["Total Users", "Total Courses", "Total Instructors", "Total Revenue", "Active Users", "Pending Approvals"]],
    body: [[
      data.stats.totalUsers,
      data.stats.totalCourses,
      data.stats.totalInstructors,
      `$${data.stats.totalRevenue.toFixed(2)}`,
      data.stats.activeUsers,
      data.stats.pendingApprovals
    ]],
    styles: { fontSize: 10, halign: 'center' },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    margin: { left: 14, right: 14 },
  });
  y = doc.lastAutoTable?.finalY + 8 || y + 30;

  // Top Instructors by Performance
  if (data.topInstructors && data.topInstructors.length > 0) {
    doc.setFontSize(13);
    doc.setTextColor(41, 128, 185);
    doc.text("Top Instructors by Performance", 14, y);
    y += 2;
    autoTable(doc, {
      startY: y + 3,
      head: [["#", "Instructor", "Email", "Courses", "Students", "Revenue", "Rating"]],
      body: data.topInstructors.map((i, index) => [
        index + 1,
        i.instructorName,
        i.email,
        i.courseCount,
        i.totalEnrollments,
        `$${i.totalRevenue.toFixed(2)}`,
        i.averageRating.toFixed(2)
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      margin: { left: 14, right: 14 },
    });
    y = doc.lastAutoTable?.finalY + 8 || y + 30;
  }

  // Recent Platform Activity
  if (data.recentActivity && data.recentActivity.length > 0) {
    const nextY = doc.lastAutoTable?.finalY || y + 30;
    doc.setFontSize(13);
    doc.setTextColor(123, 36, 160);
    doc.text("Recent Platform Activity", 14, nextY + 10);
    autoTable(doc, {
      startY: nextY + 13,
      head: [["Activity Type", "Description", "User", "Date", "Status"]],
      body: data.recentActivity.map((activity) => [
        activity.type,
        activity.description,
        activity.userName || "System",
        activity.createdAt ? format(new Date(activity.createdAt), "MMM d, yyyy") : "-",
        activity.status
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [123, 36, 160], textColor: 255 },
      margin: { left: 14, right: 14 },
    });
  }

  doc.save("admin-dashboard-report.pdf");
} 