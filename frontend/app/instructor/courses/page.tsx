"use client";

import { useState } from "react";
import { Course } from "@/types/course";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useRouter } from "next/navigation";
import { CourseFormModal } from "@/components/course/CourseFormModal";
import ListPage from "@/components/ListingPage";
import { useGetAllCourses } from "@/hooks/course/useGetAllCourse";

export default function CoursesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  

  return (
    <>
      <ListPage<Course>
        title="Course Management"
        description="Manage your courses and their content"
        entityName="Course"
        useDataHook={(params) =>
          useGetAllCourses({
            ...params,
            sortBy: params.sortBy as
              | "title"
              | "createdAt"
              | `updatedAt`,
            role: "INSTRUCTOR",
            myCourses:true,
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
            header: "Status",
            accessor: "status",
            render: (course) => <StatusBadge isActive={!course.deletedAt} />,
          },
          {
            header: "Stage",
            accessor: "status",
            render: (course) => (
              <StatusBadge isActive={course.status === "PUBLISHED"} />
            ),
          },
          {
            header: "Created",
            accessor: "createdAt",
            render: (course) => (
              <span>{new Date(course.createdAt).toLocaleDateString()}</span>
            ),
          },
        ]}
        actions={[
          {
            label: "View",
            onClick: (course) => {
              console.log("View course:", course);
              router.push(`/instructor/courses/${course.id}`);
            },
            variant: "default",
          },
        ]}
        stats={(courses, total) => [
          { title: "Total Courses", value: total },
          {
            title: "Active Courses",
            value: courses.filter((course) => course.status === "PUBLISHED")
              .length,
            color: "text-green-600",
          },
          {
            title: "Draft Courses",
            value: courses.filter((course) => course.status === "DRAFT").length,
            color: "text-yellow-600",
          },
        ]}
        sortOptions={[
          { value: "title", label: "Title" },
          { value: "createdAt", label: "Newest first" },
        ]}
        addButton={{
          label: "Create Course",
          onClick: () => setIsModalOpen(true),
        }}
        defaultSortBy="title"
      />
      <CourseFormModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
