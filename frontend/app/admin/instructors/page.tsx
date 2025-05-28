"use client";
import { IInstructorWithUserDetails } from "@/types/instructor";
import { useGetAllInstructors } from "@/hooks/instructor/useGetAllInstructor";
import { Info, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useApproveInstructor } from "@/hooks/instructor/useApproveInstructor";
import { useDeclineInstructor } from "@/hooks/instructor/useDeclineInstructor";
import { toast } from "sonner";
import { useState } from "react";
import ListPage from "@/components/ListingPage";
import { Column, SortOption, Action } from "@/types/common";

export default function InstructorsPage() {
  const router = useRouter();
  const { mutate: approveInstructor } = useApproveInstructor();
  const { mutate: declineInstructor } = useDeclineInstructor();

  const handleApprove = async (instructorId: string) => {
    approveInstructor(instructorId, {
      onSuccess: () => {
        toast.success("Instructor approved successfully");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to approve instructor");
      },
    });
  };

  const handleDecline = async (instructorId: string) => {
    declineInstructor(instructorId, {
      onSuccess: () => {
        toast.success("Instructor declined successfully");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to decline instructor");
      },
    });
  };

  const columns: Column<IInstructorWithUserDetails>[] = [
    {
      header: "Name",
      accessor: "user",
      render: (instructor) => <span>{instructor.user.name}</span>,
    },
    {
      header: "Email",
      accessor: "user",
      render: (instructor) => <span>{instructor.user.email}</span>,
    },
    {
      header: "Area of Expertise",
      accessor: "areaOfExpertise",
    },
    {
      header: "Status",
      accessor: "status",
      render: (instructor) => (
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          instructor.status === "APPROVED" 
            ? "bg-green-100 text-green-800" 
            : instructor.status === "PENDING"
            ? "bg-yellow-100 text-yellow-800"
            : instructor.status === "DECLINED"
            ? "bg-red-100 text-red-800"
            : "bg-gray-100 text-gray-800"
        }`}>
          {instructor.status}
        </div>
      ),
    },
  ];

  const actions: Action<IInstructorWithUserDetails>[] = [
    {
      label: "View Details",
      onClick: (instructor) => router.push(`/admin/instructors/${instructor.user.id}`),
      variant: "outline",
      Icon: Info,
    },
   
  ];

  const sortOptions: SortOption<IInstructorWithUserDetails>[] = [
    { label: "Created At", value: "createdAt" },
    { label: "Status", value: "status" },
    { label: "Area of Expertise", value: "areaOfExpertise" },
    { label: "Name", value: "user" },
    { label: "Email", value: "user" },
  ];


  return (
    <ListPage<IInstructorWithUserDetails>
      title="Instructor Management"
      description="Manage instructor accounts and their approval status"
      entityName="Instructor"
      useDataHook={(params) => {
        const { data, isLoading, error, refetch } = useGetAllInstructors({
          page: params.page,
          limit: params.limit,
          search: params.search,
          sortBy: params.sortBy,
          sortOrder: params.sortOrder,
          filterBy: params.filterBy as "All" | "Pending" | "Approved" | "Declined",
          includeDeleted: params.includeDeleted,
        });
        return {
          data: data?.data,
          isLoading,
          error: error ? { message: error.message } : null,
          refetch,
        };
      }}
      columns={columns}
      actions={actions}
      stats={(instructors, total) => [
        { title: "Total Instructors", value: total },
        {
          title: "Pending Requests",
          value: instructors.filter((instructor) => instructor.status === "PENDING").length,
          color: "text-yellow-600",
        },
        {
          title: "Approved Instructors",
          value: instructors.filter((instructor) => instructor.status === "APPROVED").length,
          color: "text-green-600",
        },
        {
          title: "Declined Requests",
          value: instructors.filter((instructor) => instructor.status === "DECLINED").length,
          color: "text-red-600",
        },
      ]}
      sortOptions={sortOptions}
      defaultSortBy="createdAt"
      filterOptions={[
        { label: "All", value: "All" },
        { label: "Pending", value: "Pending" },
        { label: "Approved", value: "Approved" },
        { label: "Declined", value: "Declined" },
      ]}
    />
  );
}
