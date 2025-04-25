"use client";

import { useState, useCallback } from "react";
import { Course } from "@/types/course";
import { useGetAllCourses } from "@/hooks/course/useGetAllCourse";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { StatsCards } from "@/components/ui/StatsCard";
import { TableControls } from "@/components/ui/TableControls";
import { Pagination } from "@/components/ui/Pagination";
import { CourseFormModal } from "@/components/course/CourseFormModal";
import { DataTable } from "@/components/ui/DataTable";
import { useSoftDeleteCourse } from "@/hooks/course/useSoftDeleteCourse";
import { TableSkeleton } from "@/components/skeleton/DataTableSkeleton";
import { PaginationSkeleton } from "@/components/skeleton/PaginationSkeleton";
import { StatsSkeleton } from "@/components/skeleton/StatsSkeleton";



export const courseSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(1000, "Description is too long").optional(),
  categoryId: z.string().min(1, "Category is required"),
  price: z
    .number()
    .min(0, "Price must be a positive number")
    .max(9999.99, "Price is too high"),
  duration: z.number(),
  level: z.enum(["BEGINNER", "MEDIUM", "ADVANCED"], {
    errorMap: () => ({ message: "Level is required" }),
  }),
  thumbnail: z
    .string()
    .url("Invalid URL format")
    .max(200, "Thumbnail URL is too long")
    .optional()
    .or(z.literal("")),
});

export type CourseFormData = z.infer<typeof courseSchema>;


export default function CoursesPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "createdAt">("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Active" | "Inactive"
  >("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate: toggleDeleteCourse } = useSoftDeleteCourse();

  const { data, refetch , isLoading } = useGetAllCourses({
    page,
    limit: 10,
    sortBy,
    sortOrder,
    search: searchTerm,
    filterBy: filterStatus,
    includeDeleted: true,
  });


  const courses = data?.courses || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPage || 0;


  const router = useRouter();

  const stats = [
    { title: "Total Courses", value: total },
    {
      title: "Active Courses",
      value: courses.filter((course: Course) => course.status === "PUBLISHED")
        .length,
      color: "text-green-600",
    },
    {
      title: "Draft Courses",
      value: courses.filter((course: Course) => course.status === "DRAFT")
        .length,
      color: "text-yellow-600",
    },
  ];

  // Table columns
  const columns = [
    {
      header: "Title",
      accessor: "title" as keyof Course,
      render: (course: Course) =>
        course.title || <span className="text-gray-400">N/A</span>,
    },
    {
      header: "Status",
      accessor: "status" as keyof Course,
      render: (course: Course) => (
        <StatusBadge isActive={!course.deletedAt} />
      ),
    },
    {
      header: "Stage",
      accessor: "stage" as keyof Course,
      render: (course: Course) => (
        <StatusBadge isActive={course.status === 'PUBLISHED'} />
      ),
    },
    {
      header: "Created",
      accessor: "createdAt" as keyof Course,
      render: (course: Course) =>
        new Date(course.createdAt).toLocaleDateString(),
    },
  ];

  // Actions
  const actions = [
    {
      label: () => "View",
      onClick: (course: Course) => {
        console.log("View course:", course);
        router.push(`/instructor/courses/${course.id}`);
      },
      variant: () => "default" as const,
    },
    {
      label: (course: Course) => (course.deletedAt ? "Enable" : "Disable"),
      onClick: (course: Course) => handleToggleDelete(course),
      variant: (course: Course) =>
        course.deletedAt ? "default" : "destructive",
      confirmationMessage: (course: Course) =>
        course.deletedAt
          ? `Are you sure you want to enable the course "${course.title}"?`
          : `Are you sure you want to disable the course "${course.title}"?`,
    },
  ];

  const handleToggleDelete = async (course: Course) => {
    try {
      toggleDeleteCourse(course);
    } catch (error) {
      console.error("Failed to toggle delete:", error);
      // Optionally, show a notification to the user
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Course Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your courses and their content
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Create Course
        </Button>
      </div>

      {isLoading ? <StatsSkeleton count={3} /> : <StatsCards stats={stats} />}

      <TableControls<"title" | "createdAt">
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={(status: string) =>
          setFilterStatus(status as "All" | "Active" | "Inactive")
        }
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        sortOptions={[
          { value: "title", label: "Title" },
          { value: "createdAt", label: "Newest first" },
        ]}
        onRefresh={refetch}
      />

      {isLoading ? (
              <TableSkeleton columns={3} hasActions={true} />
            ) : (
              <DataTable<Course>
                data={courses}
                columns={columns}
                isLoading={isLoading}
                actions={actions}
                itemsPerPage={10}
                totalItems={total}
                currentPage={page}
                setCurrentPage={setPage}
              />
            )}

      {isLoading ? (
              <PaginationSkeleton />
            ) : totalPages > 1 ? (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            ) : null}

      <CourseFormModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  );
}
