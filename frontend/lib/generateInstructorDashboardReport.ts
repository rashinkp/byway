import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { InstructorDashboardResponse } from "@/types/instructorDashboard";
import { format } from "date-fns";

export function generateInstructorDashboardReport(data: InstructorDashboardResponse) {
  const doc = new jsPDF({ orientation: "landscape" });
  let y = 20;

  // Platform/Report Introduction
  doc.setFontSize(20);
  doc.setTextColor(41, 128, 185);
  doc.text("Byway E-Learning Platform", 14, y);
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  y += 10;
  doc.text(
    "Instructor Dashboard Report: This report provides a summary of your course performance, student engagement, and recent activity on the platform.",
    14,
    y + 8,
    { maxWidth: 270 }
  );
  y += 25;

  // Instructor Stats Overview
  doc.setFontSize(16);
  doc.setTextColor(123, 36, 160);
  doc.text("Your Current Statistics", 14, y);
  y += 8;
  autoTable(doc, {
    startY: y,
    head: [[
      "Total Courses", "Active Courses", "Pending Courses", "Total Students", "Total Enrollments", "Total Revenue", "Average Rating", "Total Reviews"
    ]],
    body: [[
      data.stats.totalCourses,
      data.stats.activeCourses,
      data.stats.pendingCourses,
      data.stats.totalStudents,
      data.stats.totalEnrollments,
      `$${data.stats.totalRevenue.toFixed(2)}`,
      `${data.stats.averageRating.toFixed(2)}/5`,
      data.stats.totalReviews,
    ]],
    styles: { fontSize: 10, halign: 'center' },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    margin: { left: 14, right: 14 },
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  // Top Courses (if any)
  if (data.topCourses && data.topCourses.length > 0) {
    doc.setFontSize(13);
    doc.setTextColor(41, 128, 185);
    doc.text("Top Performing Courses", 14, y);
    y += 2;
    autoTable(doc, {
      startY: y + 3,
      head: [["#", "Course", "Enrollments", "Revenue", "Rating", "Reviews", "Status", "Created At", "Last Enrollment"]],
      body: data.topCourses.map((c, i) => [
        i + 1,
        c.courseTitle,
        c.enrollmentCount,
        `$${c.revenue.toFixed(2)}`,
        `${c.rating.toFixed(2)}/5`,
        c.reviewCount,
        c.status,
        c.createdAt ? format(new Date(c.createdAt), "MMM d, yyyy") : "-",
        c.lastEnrollmentDate ? format(new Date(c.lastEnrollmentDate), "MMM d, yyyy") : "-",
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      margin: { left: 14, right: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 8;
  }

  // Recent Enrollments (if any)
  if (data.recentEnrollments && data.recentEnrollments.length > 0) {
    doc.setFontSize(13);
    doc.setTextColor(123, 36, 160);
    doc.text("Recent Enrollments", 14, y);
    y += 2;
    autoTable(doc, {
      startY: y + 3,
      head: [["Course", "Student", "Enrolled At"]],
      body: data.recentEnrollments.map((e) => [
        e.courseTitle,
        e.studentName,
        e.enrolledAt ? format(new Date(e.enrolledAt), "MMM d, yyyy") : "-",
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [123, 36, 160], textColor: 255 },
      margin: { left: 14, right: 14 },
    });
  }

  doc.save("instructor-dashboard-report.pdf");
} 