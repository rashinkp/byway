"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { User } from "@/types/user";
import { DataTable } from "@/components/ui/DataTable";
import { StatsCards } from "@/components/ui/StatsCard";
import { TableControls } from "@/components/ui/TableControls";
import { useGetAllUsers } from "@/hooks/user/useGetAllUsers";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useToggleDeleteUser } from "@/hooks/user/useToggleDeleteUser";
import { Pagination } from "@/components/ui/Pagination";
import { StatsSkeleton } from "@/components/skeleton/StatsSkeleton";
import { TableSkeleton } from "@/components/skeleton/DataTableSkeleton";
import { PaginationSkeleton } from "@/components/skeleton/PaginationSkeleton";
import ErrorDisplay from "@/components/ErrorDisplay";

interface InstructorFormData {
  name: string;
  email: string;
  role: "INSTRUCTOR";
}

export default function InstructorsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Active" | "Inactive">("All");
  const [sortBy, setSortBy] = useState<"name" | "email" | "createdAt" | "-createdAt">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editInstructor, setEditInstructor] = useState<User | undefined>(undefined);


  const { data, isLoading, error, refetch } = useGetAllUsers({
    page,
    limit: 10,
    sortBy,
    sortOrder,
    includeDeleted: true,
    search: searchTerm,
    filterBy: filterStatus,
    role: "INSTRUCTOR",
  });

  const instructors = data?.data?.items || [];
  const total = data?.data?.total || 0;
  const totalPages = data?.data?.totalPages || 0;

  
  const { mutate: toggleDeleteUser } = useToggleDeleteUser();

  const stats = [
    { title: "Total Instructors", value: total },
    {
      title: "Active Instructors",
      value: instructors.filter((instructor) => !instructor.deletedAt).length,
      color: "text-green-600",
    },
    {
      title: "Inactive Instructors",
      value: instructors.filter((instructor) => instructor.deletedAt).length,
      color: "text-red-600",
    },
  ];

  const columns = [
    {
      header: "Name",
      accessor: "name" as keyof User,
      render: (user: User) => user.name || <span className="text-gray-400">N/A</span>,
    },
    {
      header: "Email",
      accessor: "email" as keyof User,
    },
    {
      header: "Status",
      accessor: "deletedAt" as keyof User,
      render: (user: User) => <StatusBadge isActive={!user.deletedAt} />,
    },
  ];

  const actions = [
    {
      label: "Edit",
      onClick: (instructor: User) => {
        setEditInstructor(instructor);
        setIsEditOpen(true);
      },
    },
    {
      label: (instructor: User) => (instructor.deletedAt ? "Enable" : "Disable"),
      onClick: (instructor: User) => toggleDeleteUser(instructor),
      variant: (instructor: User) => (instructor.deletedAt ? "default" : "destructive"),
      confirmationMessage: (instructor: User) =>
        instructor.deletedAt
          ? `Are you sure you want to enable the instructor "${instructor.name || instructor.email}"?`
          : `Are you sure you want to disable the instructor "${instructor.name || instructor.email}"?`,
    },
  ];

  


  if (error) {
    return (
      <ErrorDisplay
        title="Instructor Page Error"
        description="Instructor page error occured. Please try again"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Instructor Management</h1>
          <p className="text-gray-500 mt-1">Manage instructor accounts and their access</p>
        </div>
        <div className="flex space-x-2">
          {/* <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleViewRequests}
          >
            <Users className="mr-2 h-4 w-4" />
            Requests
          </Button> */}
         
        </div>
      </div>

      {isLoading ? <StatsSkeleton count={3} /> : <StatsCards stats={stats} />}

      <TableControls<"name" | "email" | "createdAt" | "-createdAt">
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
          { value: "name", label: "Name" },
          { value: "email", label: "Email" },
          { value: "createdAt", label: "Newest first" },
        ]}
        onRefresh={refetch}
      />

      {isLoading ? (
        <TableSkeleton columns={3} hasActions={true} />
      ) : (
        <DataTable<User>
          data={instructors}
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