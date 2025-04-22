"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";
import { DataTable } from "@/components/ui/DataTable";
import { StatsCards } from "@/components/ui/StatsCard";
import { TableControls } from "@/components/ui/TableControls";
import { useGetAllCourses } from "@/hooks/course/useGetAllCourse";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Pagination } from "@/components/ui/Pagination";
import { BookOpen } from "lucide-react";

export default function CoursesPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<
    "createdAt" | "name" | "updatedAt" | undefined
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Active" | "Draft" | "Inactive" | undefined
  >("All");

  const { data, isLoading, refetch } = useGetAllCourses({
    page,
    limit: 10,
    sortBy,
    sortOrder,
    includeDeleted: true,
    search: searchTerm,
    filterBy: filterStatus,
  });

  const courses = data?.courses || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPage || 0;


  const stats = [
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
  ];

  const columns = [
    {
      header: "Title",
      accessor: "title" as keyof Course,
      render: (course: Course) =>
        course.title || <span className="text-gray-400">N/A</span>,
    },
    {
      header: "Instructor",
      accessor: "instructor" as keyof Course,
      render: (course: Course) =>
        course.createdBy || <span className="text-gray-400">N/A</span>,
    },
    {
      header: "Status",
      accessor: "deletedAt" as keyof Course,
      render: (course: Course) => <StatusBadge isActive={!course.deletedAt} />,
    },
  ];

  const actions = [
      {
        label: 'View',
        Icon: BookOpen,
        onClick: (course: Course) => {
          console.log("View course clicked", course);
          // Example: router.push(`/admin/courses/${course.id}`);
        },
      }
    ];

  const handleViewRequests = () => {
    console.log("View course creation requests clicked");
    // Example: router.push("/admin/course-requests");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Course Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage courses and their visibility
          </p>
        </div>
        <Button
          onClick={handleViewRequests}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Course Requests
        </Button>
      </div>

      <StatsCards stats={stats} />

      <TableControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus || ""}
        setFilterStatus={(status: string) =>
          setFilterStatus(status as "All" | "Active" | "Inactive")
        }
        sortBy={sortBy || "title"}
        setSortBy={(sort: string) => setSortBy(sort as "createdAt" | "name" | "updatedAt" | undefined)}
        sortOptions={[
          { value: "title", label: "Title (A-Z)" },
          { value: "instructor", label: "Instructor (A-Z)" },
          { value: "newest", label: "Newest first" },
          { value: "oldest", label: "Oldest first" },
        ]}
        onRefresh={refetch}
      />

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

      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
