"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";
import { Course } from "@/types/course";
import { DataTable } from "@/components/ui/DataTable";
import { StatsCards } from "@/components/ui/StatsCard";
import { TableControls } from "@/components/ui/TableControls";
import { useGetAllCourses } from "@/hooks/course/useGetAllCourse";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Pagination } from "@/components/ui/Pagination";
import { StatsSkeleton } from "@/components/skeleton/StatsSkeleton";
import { TableSkeleton } from "@/components/skeleton/DataTableSkeleton";
import { PaginationSkeleton } from "@/components/skeleton/PaginationSkeleton";
import { useSoftDeleteCourse } from "@/hooks/course/useSoftDeleteCourse";


export default function CoursesPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Active" | "Inactive">("All");
  const [sortBy, setSortBy] = useState<"title" | "createdAt" >("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");



  const { data, isLoading, error, refetch } = useGetAllCourses({
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

  
  const { mutate: toggleDeleteCourse } = useSoftDeleteCourse();

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
      render: (course: Course) => course.title || <span className="text-gray-400">N/A</span>,
    },
    {
      header: "Instructor",
      accessor: "createdBy" as keyof Course,
      render: (course: Course) => course.createdBy || <span className="text-gray-400">N/A</span>,
    },
    {
      header: "Status",
      accessor: "deletedAt" as keyof Course,
      render: (course: Course) => <StatusBadge isActive={!course.deletedAt} />,
    },
  ];

  const actions = [
    {
      label: "View",
      Icon: BookOpen,
      onClick: (course: Course) => {
        console.log("View course clicked", course);
        // Example: router.push(`/admin/courses/${course.id}`);
      },
    },
    {
      label: (course: Course) => (course.deletedAt ? "Enable" : "Disable"),
      onClick: (course: Course) => toggleDeleteCourse(course),
      variant: (course: Course) => (course.deletedAt ? "default" : "destructive"),
      confirmationMessage: (course: Course) =>
        course.deletedAt
          ? `Are you sure you want to enable the course "${course.title}"?`
          : `Are you sure you want to disable the course "${course.title}"?`,
    },
  ];

 

 

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Course Management</h1>
            <p className="text-gray-500 mt-1">Manage courses and their visibility</p>
          </div>
          <div className="flex space-x-2">
            {/* <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleViewRequests}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Course Requests
            </Button> */}
          </div>
        </div>
        <div className="text-red-600">
          <p>Error: {error.message}</p>
          <Button onClick={() => refetch()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Course Management</h1>
          <p className="text-gray-500 mt-1">Manage courses and their visibility</p>
        </div>
        <div className="flex space-x-2">
          {/* <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleViewRequests}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Course Requests
          </Button> */}
          
        </div>
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
    </div>
  );
}