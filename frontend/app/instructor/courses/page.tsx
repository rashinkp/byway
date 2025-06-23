"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Info, Plus, Edit } from "lucide-react";
import { useGetAllCourses } from "@/hooks/course/useGetAllCourse";
import { useGetCourseStats } from "@/hooks/course/useGetCourseStats";
import ListPage from "@/components/ListingPage";
import { Course } from "@/types/course";
import { useAuth } from "@/hooks/auth/useAuth";
import { CourseFormModal } from "@/components/course/CourseFormModal";

export default function CoursesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: statsData } = useGetCourseStats();

  return (
    <>
      <ListPage<Course>
        title="My Courses"
        description="Manage and monitor your course performance"
        entityName="Course"
        role={user?.role as "ADMIN" | "USER" | "INSTRUCTOR" | undefined}
        useDataHook={(params) =>
          useGetAllCourses({
            ...params,
            sortBy: params.sortBy as "title" | "createdAt" | "price" | undefined,
            role: user?.role as "ADMIN" | "USER" | "INSTRUCTOR" | undefined,
            filterBy: params.filterBy as "All" | "Active" | "Inactive" | "Approved" | "Declined" | "Pending" | "Published" | "Draft" | "Archived" | undefined,
            includeDeleted: true,
            myCourses: true,
          })
        }
        columns={[
          {
            header: "Title",
            accessor: "title",
            render: (course: Course) =>
              course.title ? (
                <span className="font-medium">{course.title}</span>
              ) : (
                <span className="text-gray-400">N/A</span>
              ),
          },
          {
            header: "Approval Status",
            accessor: "approvalStatus",
            render: (course: Course) => (
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
            header: "Publish Status",
            accessor: "status",
            render: (course: Course) => (
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                course.status === "PUBLISHED" 
                  ? "bg-blue-100 text-blue-800" 
                  : course.status === "DRAFT"
                  ? "bg-gray-100 text-gray-800"
                  : course.status === "ARCHIVED"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-gray-100 text-gray-800"
              }`}>
                {course.status}
              </div>
            ),
          },
          {
            header: "Price",
            accessor: "price",
            render: (course: Course) => (
              <span className="font-medium">
                ${Number(course.price).toFixed(2)}
              </span>
            ),
          },
          {
            header: "Created",
            accessor: "createdAt",
            render: (course: Course) => (
              <span className="text-sm text-gray-600">
                {new Date(course.createdAt).toLocaleDateString()}
              </span>
            ),
          },
        ]}
        actions={[
          {
            label: "View Details",
            onClick: (course: Course) => router.push(`/instructor/courses/${course.id}`),
            variant: "outline",
            Icon: Info,
          },
        ]}
        stats={(courses: Course[], total: number) => 
          statsData ? [
            { 
              title: "Total Courses", 
              value: total,
              icon: "list"
            },
            {
              title: "Published Courses",
              value: courses.filter((course) => course.status === "PUBLISHED").length,
              icon: "check"
            },
            {
              title: "Draft Courses",
              value: courses.filter((course) => course.status === "DRAFT").length,
              icon: "book"
            },
            {
              title: "Approved Courses",
              value: courses.filter((course) => course.approvalStatus === "APPROVED").length,
              icon: "check"
            },
            {
              title: "Pending Approval",
              value: courses.filter((course) => course.approvalStatus === "PENDING").length,
              icon: "clock"
            },
            {
              title: "Declined Courses",
              value: courses.filter((course) => course.approvalStatus === "DECLINED").length,
              icon: "alert"
            },
          ] : []
        }
        sortOptions={[
          { value: "title", label: "Title" },
          { value: "createdAt", label: "Date" },
          { value: "price", label: "Price" },
        ]}
        defaultSortBy="title"
        filterOptions={[
          { label: "All", value: "All" },
          { label: "Active", value: "Active" },
          { label: "Inactive", value: "Inactive" },
          { label: "Approved", value: "Approved" },
          { label: "Declined", value: "Declined" },
          { label: "Pending", value: "Pending" },
          { label: "Published", value: "Published" },
          { label: "Draft", value: "Draft" },
          { label: "Archived", value: "Archived" },
        ]}
        addButton={{
          label: "Create Course",
          onClick: () => setIsModalOpen(true),
        }}
      />
      <CourseFormModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
