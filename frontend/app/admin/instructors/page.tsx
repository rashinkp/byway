"use client";

import { useState } from "react";
import { User } from "@/types/user";
import { useGetAllUsers } from "@/hooks/user/useGetAllUsers";
import { useToggleDeleteUser } from "@/hooks/user/useToggleDeleteUser";
import { StatusBadge } from "@/components/ui/StatusBadge";
import ListPage from "@/components/ListingPage";
import { InstructorApprovalModal } from "@/components/instructor/InstructorApprovalModal";

export default function InstructorsPage() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editInstructor, setEditInstructor] = useState<User | undefined>(
    undefined
  );

  const { mutate: toggleDeleteUser } = useToggleDeleteUser();

  return (
    <ListPage<User>
      title="Instructor Management"
      description="Manage instructor accounts and their access"
      entityName="Instructor"
      useDataHook={(params) =>
        useGetAllUsers({
          ...params,
          sortBy: params.sortBy as
            | "name"
            | "email"
            | "createdAt"
            | `-${"name" | "email" | "createdAt"}`,
          role: "INSTRUCTOR",
        })
      }
      columns={[
        {
          header: "Name",
          accessor: "name",
          render: (user) =>
            user.name ? (
              <span>{user.name}</span>
            ) : (
              <span className="text-gray-400">N/A</span>
            ),
        },
        {
          header: "Email",
          accessor: "email",
        },
        {
          header: "Status",
          accessor: "deletedAt",
          render: (user) => <StatusBadge isActive={!user.deletedAt} />,
        },
      ]}
      actions={[
        {
          label: "Edit",
          onClick: (instructor) => {
            setEditInstructor(instructor);
            setIsEditOpen(true);
          },
          variant: "outline",
        },
        {
          label: (instructor) => (instructor.deletedAt ? "Enable" : "Disable"),
          onClick: (instructor) => toggleDeleteUser(instructor),
          variant: (instructor) =>
            instructor.deletedAt ? "default" : "destructive",
          confirmationMessage: (instructor) =>
            instructor.deletedAt
              ? `Are you sure you want to enable the instructor "${
                  instructor.name || instructor.email
                }"?`
              : `Are you sure you want to disable the instructor "${
                  instructor.name || instructor.email
                }"?`,
        },
      ]}
      stats={(instructors, total) => [
        { title: "Total Instructors", value: total },
        {
          title: "Active Instructors",
          value: instructors.filter((instructor) => !instructor.deletedAt)
            .length,
          color: "text-green-600",
        },
        {
          title: "Inactive Instructors",
          value: instructors.filter((instructor) => !instructor.deletedAt)
            .length,
          color: "text-red-600",
        },
      ]}
      sortOptions={[
        { value: "name", label: "Name" },
        { value: "email", label: "Email" },
        { value: "createdAt", label: "Newest first" },
      ]}
      defaultSortBy="name"
      role="INSTRUCTOR"
      extraButtons={[<InstructorApprovalModal key="approval-modal" />]}
    />
  );
}
