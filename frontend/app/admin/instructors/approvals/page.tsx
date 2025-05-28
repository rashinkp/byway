"use client";
import { IInstructorWithUserDetails } from "@/types/instructor";
import { useGetAllInstructors } from "@/hooks/instructor/useGetAllInstructor";
import ListPage from "@/components/ListingPage";
import { Info, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useApproveInstructor } from "@/hooks/instructor/useApproveInstructor";
import { useDeclineInstructor } from "@/hooks/instructor/useDeclineInstructor";
import { toast } from "sonner";

export default function InstructorApprovalsPage() {
  const router = useRouter();
  const { mutate: approveInstructor } = useApproveInstructor();
  const { mutate: declineInstructor } = useDeclineInstructor();

  const handleApprove = async (instructorId: string) => {
    try {
      await approveInstructor(instructorId);
      toast.success("Instructor approved successfully!");
    } catch (error) {
      console.error("Error approving instructor:", error);
      toast.error("Failed to approve instructor");
    }
  };

  const handleDecline = async (instructorId: string) => {
    try {
      await declineInstructor(instructorId);
      toast.success("Instructor declined successfully!");
    } catch (error) {
      console.error("Error declining instructor:", error);
      toast.error("Failed to decline instructor");
    }
  };

  const getStatusBadge = (status: string) => {
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          status === "PENDING"
            ? "bg-yellow-100 text-yellow-800"
            : status === "APPROVED"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <ListPage<IInstructorWithUserDetails>
      title="Instructor Approvals"
      description="Review and manage instructor approval requests"
      entityName="Instructor"
      useDataHook={() => {
        const { data, isLoading, error, refetch } = useGetAllInstructors();
        return {
          data: data?.data,
          isLoading,
          error: error ? { message: error.message } : null,
          refetch
        };
      }}
      columns={[
        {
          header: "Name",
          accessor: "user",
          render: (instructor) => (
            <span>{instructor.user.name || "N/A"}</span>
          ),
        },
        {
          header: "Email",
          accessor: "user",
          render: (instructor) => (
            <span>{instructor.user.email}</span>
          ),
        },
        {
          header: "Status",
          accessor: "status",
          render: (instructor) => getStatusBadge(instructor.status),
        },
        {
          header: "Area of Expertise",
          accessor: "areaOfExpertise",
          render: (instructor) => (
            <span>{instructor.areaOfExpertise || "N/A"}</span>
          ),
        },
      ]}
      actions={[
        {
          label: "View Details",
          onClick: (instructor) => router.push(`/admin/instructors/${instructor.user.id}`),
          variant: "outline",
          Icon: Info,
        },
        {
          label: "Approve",
          onClick: (instructor) => handleApprove(instructor.id),
          variant: "default",
          Icon: Check,
          hidden: (instructor) => instructor.status !== "PENDING" && instructor.status !== "DECLINED",
        },
        {
          label: "Decline",
          onClick: (instructor) => handleDecline(instructor.id),
          variant: "destructive",
          Icon: X,
          hidden: (instructor) => instructor.status !== "PENDING",
        },
      ]}
      stats={(instructors, total) => [
        { title: "Total Requests", value: total },
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
      sortOptions={[
        { value: "createdAt", label: "Newest first" },
        { value: "status", label: "Status" },
        { value: "areaOfExpertise", label: "Area of Expertise" }
      ]}
      defaultSortBy="createdAt"
      filterOptions={[
        { value: "All", label: "All Requests" },
        { value: "Pending", label: "Pending" },
        { value: "Approved", label: "Approved" },
        { value: "Declined", label: "Declined" }
      ]}
    />
  );
} 