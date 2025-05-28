"use client";
import { Course } from "@/types/course";
import { StatusBadge } from "@/components/ui/StatusBadge";
import ListPage from "@/components/ListingPage";
import { useGetAllCourses } from "@/hooks/course/useGetAllCourse";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth/useAuth";
import { Info } from "lucide-react";

export default function CoursesPage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <ListPage<Course>
      title="Course Management"
      description="Manage courses and their visibility"
      entityName="Course"
      role={user?.role as "ADMIN" | "USER" | "INSTRUCTOR" | undefined}
      useDataHook={(params) =>
        useGetAllCourses({
          ...params,
          sortBy: params.sortBy as
            | "title"
            | "createdAt"
            | "updatedAt"
            | "price"
            | "duration",
          role: user?.role as "ADMIN" | "USER" | "INSTRUCTOR" | undefined,
          filterBy: params.filterBy as "All" | "Active" | "Inactive" | "Declined",
          includeDeleted: true,
          myCourses: false,
        })
      }
      columns={[
        {
          header: "Title",
          accessor: "title",
          render: (course) =>
            course.title ? (
              <span>{course.title}</span>
            ) : (
              <span className="text-gray-400">N/A</span>
            ),
        },
        {
          header: "Instructor",
          accessor: "createdBy",
          render: (course) =>
            course.createdBy ? (
              <span>{course.createdBy}</span>
            ) : (
              <span className="text-gray-400">N/A</span>
            ),
        },
        {
          header: "Approval Status",
          accessor: "approvalStatus",
          render: (course) => (
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              course.approvalStatus === "APPROVED" 
                ? "bg-green-100 text-green-800" 
                : course.approvalStatus === "PENDING"
                ? "bg-yellow-100 text-yellow-800"
                : course.approvalStatus === "DECLINED"
                ? "bg-red-100 text-red-800"
                : "bg-gray-100 text-gray-800"
            }`}>
              {course.approvalStatus}
            </div>
          ),
        },
        {
          header: "Status",
          accessor: "deletedAt",
          render: (course) => <StatusBadge isActive={!course.deletedAt} />,
        },
      ]}
      actions={[
        {
          label: "View Details",
          onClick: (course) => router.push(`/admin/courses/${course.id}`),
          variant: "outline",
          Icon: Info,
        },
      ]}
      stats={(courses, total) => [
        { title: "Total Courses", value: total },
        {
          title: "Active Courses",
          value: courses.filter((course) => !course.deletedAt).length,
          color: "text-green-600",
        },
        {
          title: "Inactive Courses",
          value: courses.filter((course) => course.deletedAt).length,
          color: "text-red-600",
        },
        {
          title: "Pending Approvals",
          value: courses.filter((course) => course.approvalStatus === "PENDING").length,
          color: "text-yellow-600",
        },
        {
          title: "Declined Courses",
          value: courses.filter((course) => course.approvalStatus === "DECLINED").length,
          color: "text-red-600",
        },
      ]}
      sortOptions={[
        { value: "title", label: "Title" },
        { value: "createdAt", label: "Newest first" },
        { value: "approvalStatus", label: "Approval Status" },
      ]}
      defaultSortBy="title"
      filterOptions={[
        { label: "All", value: "All" },
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
        { label: "Declined", value: "Declined" },
      ]}
    />
  );
}
