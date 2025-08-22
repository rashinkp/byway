import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { InstructorDashboardResponse } from "@/types/instructor";
import { format } from "date-fns";

// Extend jsPDF interface to include autoTable properties
interface jsPDFWithAutoTable extends jsPDF {
	lastAutoTable?: {
		finalY?: number;
	};
}

export function generateInstructorDashboardReport(data: InstructorDashboardResponse) {
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
    "Instructor Dashboard Report: This report provides a comprehensive overview of your teaching performance, course statistics, and student engagement metrics.",
    14,
    y + 8,
    { maxWidth: 270 }
  );
  y += 25;

  // Instructor Statistics Overview
  doc.setFontSize(16);
  doc.setTextColor(123, 36, 160);
  doc.text("Instructor Statistics Overview", 14, y);
  y += 8;
  autoTable(doc, {
    startY: y,
    head: [["Total Courses", "Total Students", "Total Enrollments", "Total Revenue", "Average Rating", "Total Reviews"]],
    body: [[
      data.stats.totalCourses,
      data.stats.totalStudents,
      data.stats.totalEnrollments,
      `$${data.stats.totalRevenue.toFixed(2)}`,
      data.stats.averageRating.toFixed(2),
      data.stats.totalReviews
    ]],
    styles: { fontSize: 10, halign: 'center' },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    margin: { left: 14, right: 14 },
  });
  y = (doc.lastAutoTable?.finalY ?? y) + 8;

  // Top Courses by Enrollments
  if (data.topCourses && data.topCourses.length > 0) {
    doc.setFontSize(13);
    doc.setTextColor(41, 128, 185);
    doc.text("Top Courses by Enrollments", 14, y);
    y += 2;
    autoTable(doc, {
      startY: y + 3,
      head: [["#", "Course", "Enrollments", "Revenue", "Rating", "Reviews", "Status"]],
      body: data.topCourses.map((c, i) => [
        i + 1,
        c.courseTitle,
        c.enrollmentCount,
        `$${c.revenue.toFixed(2)}`,
        c.rating.toFixed(2),
        c.reviewCount,
        c.status
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      margin: { left: 14, right: 14 },
    });
    y = (doc.lastAutoTable?.finalY ?? y) + 8;
  }

  // Recent Students
  if (data.recentStudents && data.recentStudents.length > 0) {
    doc.setFontSize(13);
    doc.setTextColor(123, 36, 160);
    doc.text("Recent Students", 14, y);
    y += 2;
    autoTable(doc, {
      startY: y + 3,
      head: [["Student Name", "Email", "Enrolled Courses", "Last Enrollment", "Status"]],
      body: data.recentStudents.map((s) => [
        s.studentName,
        s.email,
        s.enrolledCourses.toString(),
        s.lastEnrollmentDate ? format(new Date(s.lastEnrollmentDate), "MMM d, yyyy") : "-",
        s.isActive ? "Active" : "Inactive"
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [123, 36, 160], textColor: 255 },
      margin: { left: 14, right: 14 },
    });
  }

  doc.save("instructor-dashboard-report.pdf");
} 