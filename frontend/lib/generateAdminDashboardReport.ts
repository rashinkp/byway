import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Define the expected data type (adjust as needed)
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

export function generateAdminDashboardReport(data: DashboardData) {
  const doc = new jsPDF({ orientation: "landscape" });
  let y = 20;

  // Platform Introduction
  doc.setFontSize(20);
  doc.setTextColor(41, 128, 185);
  doc.text("Byway E-Learning Platform", 14, y);
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  y += 10;
  doc.text(
    "Byway is a modern e-learning platform empowering learners and instructors with flexible, accessible, and high-quality online education. This report provides a comprehensive overview of the platform's current performance and key statistics for administrators.",
    14,
    y + 8,
    { maxWidth: 270 }
  );
  y += 25;

  // Report Title
  doc.setFontSize(16);
  doc.setTextColor(123, 36, 160);
  doc.text("Admin Dashboard Report", 14, y);
  y += 8;

  // Section: Current Platform Stats
  doc.setFontSize(13);
  doc.setTextColor(0, 0, 0);
  doc.text("Current Platform Statistics", 14, y += 10);
  y += 2;
  autoTable(doc, {
    startY: y + 3,
    head: [[
      "Total Courses", "Active Courses", "Pending Courses",
      "Total Instructors", "Active Instructors", "Inactive Instructors",
      "Total Users", "Active Users", "Inactive Users",
      "Total Revenue", "Total Enrollments"
    ]],
    body: [[
      data.stats.courseStats.totalCourses,
      data.stats.courseStats.activeCourses,
      data.stats.courseStats.pendingCourses,
      data.stats.userStats.totalInstructors,
      data.stats.userStats.activeInstructors,
      data.stats.userStats.inactiveInstructors,
      data.stats.userStats.totalUsers,
      data.stats.userStats.activeUsers,
      data.stats.userStats.inactiveUsers,
      `$${data.stats.totalRevenue.toFixed(2)}`,
      data.stats.enrollmentStats.totalEnrollments,
    ]],
    styles: { fontSize: 10, halign: 'center' },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    margin: { left: 14, right: 14 },
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  // Top Enrolled Courses Table
  doc.setFontSize(13);
  doc.setTextColor(41, 128, 185);
  doc.text("Top Enrolled Courses", 14, y);
  y += 2;
  autoTable(doc, {
    startY: y + 3,
    head: [["#", "Course", "Instructor", "Enrollments", "Revenue", "Rating", "Reviews"]],
    body: data.topEnrolledCourses.map((c, i) => [
      i + 1,
      c.courseTitle,
      c.instructorName,
      c.enrollmentCount,
      `$${c.revenue.toFixed(2)}`,
      c.rating,
      c.reviewCount,
    ]),
    styles: { fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    margin: { left: 14, right: 14 },
  });

  // Top Instructors Table
  const nextY = (doc as any).lastAutoTable.finalY || y + 30;
  doc.setFontSize(13);
  doc.setTextColor(123, 36, 160);
  doc.text("Top Performing Instructors", 14, nextY + 10);
  autoTable(doc, {
    startY: nextY + 13,
    head: [["#", "Instructor", "Email", "Status", "Courses", "Enrollments", "Revenue", "Avg. Rating"]],
    body: data.topInstructors.map((inst, i) => [
      i + 1,
      inst.instructorName,
      inst.email,
      inst.isActive ? "Active" : "Inactive",
      inst.courseCount,
      inst.totalEnrollments,
      `$${inst.totalRevenue.toFixed(2)}`,
      inst.averageRating.toFixed(2),
    ]),
    styles: { fontSize: 10 },
    headStyles: { fillColor: [123, 36, 160], textColor: 255 },
    margin: { left: 14, right: 14 },
  });

  doc.save("admin-dashboard-report.pdf");
} 