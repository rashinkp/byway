import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { OverallRevenueResponse, CourseRevenueResponse, LatestRevenueResponse } from "@/types/analytics";
import { format } from "date-fns";

export function generateRevenueAnalyticsReport(
  overallData: OverallRevenueResponse["data"],
  courseData: CourseRevenueResponse["data"],
  latestData?: LatestRevenueResponse["data"]
) {
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
    "Revenue Analytics Report: This report provides a detailed overview of revenue performance, top courses, and recent transactions for the selected period.",
    14,
    y + 8,
    { maxWidth: 270 }
  );
  y += 25;

  // Format period dates
  const periodStart = overallData.period.start ? format(new Date(overallData.period.start), "MMM d, yyyy") : "-";
  const periodEnd = overallData.period.end ? format(new Date(overallData.period.end), "MMM d, yyyy") : "-";

  // Revenue Overview
  doc.setFontSize(16);
  doc.setTextColor(123, 36, 160);
  doc.text("Revenue Overview", 14, y);
  y += 8;
  autoTable(doc, {
    startY: y,
    head: [["Total Revenue", "Net Revenue", "Refunded", "Courses Sold", "Period"]],
    body: [[
      `$${overallData.totalRevenue.toFixed(2)}`,
      `$${overallData.netRevenue.toFixed(2)}`,
      `$${overallData.refundedAmount.toFixed(2)}`,
      overallData.coursesSold,
      `${periodStart} to ${periodEnd}`
    ]],
    styles: { fontSize: 10, halign: 'center' },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    margin: { left: 14, right: 14 },
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  // Top Courses by Revenue (only if there are courses)
  if (courseData.courses && courseData.courses.length > 0) {
    doc.setFontSize(13);
    doc.setTextColor(41, 128, 185);
    doc.text("Top Courses by Revenue", 14, y);
    y += 2;
    autoTable(doc, {
      startY: y + 3,
      head: [["#", "Course", "Instructor", "Revenue", "Enrollments", "Net Revenue"]],
      body: courseData.courses.map((c, i) => [
        i + 1,
        c.title,
        c.creator.name,
        `$${c.totalRevenue.toFixed(2)}`,
        c.enrollments,
        `$${c.netRevenue.toFixed(2)}`
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      margin: { left: 14, right: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 8;
  }

  // Latest Revenue Transactions (if available)
  if (latestData && latestData.items.length > 0) {
    let nextY = (doc as any).lastAutoTable?.finalY || y + 30;
    doc.setFontSize(13);
    doc.setTextColor(123, 36, 160);
    doc.text("Latest Revenue Transactions", 14, nextY + 10);
    autoTable(doc, {
      startY: nextY + 13,
      head: [["Order ID", "Course", "Customer", "Amount", "Date"]],
      body: latestData.items.map((item) => [
        item.orderId,
        item.courseTitle,
        item.customerName,
        `$${item.transactionAmount.toFixed(2)}`,
        item.createdAt ? format(new Date(item.createdAt), "MMM d, yyyy") : "-"
      ]),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [123, 36, 160], textColor: 255 },
      margin: { left: 14, right: 14 },
    });
  }

  doc.save("revenue-analytics-report.pdf");
} 