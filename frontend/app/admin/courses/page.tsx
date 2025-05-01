"use client";

import { BookOpen } from "lucide-react";
import { Course } from "@/types/course";
import { useSoftDeleteCourse } from "@/hooks/course/useSoftDeleteCourse";
import { StatusBadge } from "@/components/ui/StatusBadge";
import ListPage from "@/components/ListingPage";
import { useGetAllCourses } from "@/hooks/course/useGetAllCourse";

export default function CoursesPage() {
  const { mutate: toggleDeleteCourse } = useSoftDeleteCourse();

  return (
    <ListPage<Course>
      title="Course Management"
      description="Manage courses and their visibility"
      entityName="Course"
      useDataHook={(params) =>
        useGetAllCourses({
          ...params,
          sortBy: params.sortBy as
            | "title"
            | "createdAt"
            | `-${"title" | "createdAt"}`,
        })
      }
      columns={[
        {
          header: "Title",
          accessor: "title",
          render: (course) => course.title ? 
            (<span>{course.title}</span>) : (
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
          header: "Status",
          accessor: "deletedAt",
          render: (course) => <StatusBadge isActive={!course.deletedAt} />,
        },
      ]}
      actions={[
        {
          label: "View", 
          onClick: (course) => {
            console.log("View course clicked", course);
            // Example: router.push(`/admin/courses/${course.id}`);
          },
          variant: "outline",
        },
        {
          label: (course) => (course.deletedAt ? "Enable" : "Disable"),
          onClick: (course) => toggleDeleteCourse(course),
          variant: (course) => (course.deletedAt ? "default" : "destructive"),
          confirmationMessage: (course) =>
            course.deletedAt
              ? `Are you sure you want to enable the course "${course.title}"?`
              : `Are you sure you want to disable the course "${course.title}"?`,
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
      ]}
      sortOptions={[
        { value: "title", label: "Title" },
        { value: "createdAt", label: "Newest first" },
      ]}
      defaultSortBy="title"
    />
  );
}
