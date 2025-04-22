"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { DataTable } from "@/components/ui/DataTable";
import { StatsCards } from "@/components/ui/StatsCard";
import { TableControls } from "@/components/ui/TableControls";
import { useGetAllUsers } from "@/hooks/user/useGetAllUsers";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useToggleDeleteUser } from "@/hooks/user/useToggleDeleteUser";
import { Pagination } from "@/components/ui/Pagination";
import { Users } from "lucide-react";
import { PageSkeleton } from "@/components/skeleton/ListingPageSkeleton";

export default function InstructorsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Active" | "Inactive"
  >("All");

  const { data, isLoading, refetch ,error } = useGetAllUsers({
    page,
    limit: 10,
    sortBy,
    sortOrder,
    includeDeleted: true,
    search: searchTerm,
    filterBy: filterStatus,
    role: "INSTRUCTOR", // Filter for instructors
  });

  // Access the correct data structure
  const instructors = data?.data?.items || [];
  const total = data?.data?.total || 0;
  const totalPages = data?.data?.totalPages || 0;

  console.log(data);

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

  // Table columns
  const columns = [
    {
      header: "Name",
      accessor: "name" as keyof User,
      render: (user: User) =>
        user.name || <span className="text-gray-400">N/A</span>,
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

  // Actions
  const actions = [
    {
      label: (user: User) => (user.deletedAt ? "Restore" : "Delete"),
      onClick: (user: User) => {
        handleToggleDelete(user);
        console.log("Toggle delete instructor:", user);
      },
      variant: (user: User) => (user.deletedAt ? "default" : "destructive"),
    },
  ];

  const handleToggleDelete = async (user: User) => {
    toggleDeleteUser(user);
  };

  const handleViewRequests = () => {
    // Placeholder: Navigate to requests page or open modal
    console.log("View instructor requests clicked");
    // Example: router.push("/admin/instructor-requests");
  };

   if (isLoading) {
      return <PageSkeleton tableColumns={3} />;
    }
  
    if (error) {
      return (
        <div className="space-y-6">
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
          <h1 className="text-3xl font-bold text-gray-800">
            Instructor Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage instructor accounts and their access
          </p>
        </div>
        <Button
          onClick={handleViewRequests}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Users className="mr-2 h-4 w-4" />
          Requests
        </Button>
      </div>

      <StatsCards stats={stats} />

      <TableControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={(status: string) =>
          setFilterStatus(status as "All" | "Active" | "Inactive")
        }
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOptions={[
          { value: "name", label: "Name (A-Z)" },
          { value: "email", label: "Email (A-Z)" },
          { value: "newest", label: "Newest first" },
          { value: "oldest", label: "Oldest first" },
        ]}
        onRefresh={refetch}
      />

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
