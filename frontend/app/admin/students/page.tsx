"use client";

import { User } from "@/types/user";
import { useGetAllUsers } from "@/hooks/user/useGetAllUsers";
import { useToggleDeleteUser } from "@/hooks/user/useToggleDeleteUser";
import { StatusBadge } from "@/components/ui/StatusBadge";
import ListPage from "@/components/ListingPage";

export default function StudentsPage() {
  const { mutate: toggleDeleteUser } = useToggleDeleteUser();

  return (
    <ListPage<User>
      title="Student Management"
      description="Manage student accounts and their access"
      entityName="Student"
      useDataHook={(params) =>
        useGetAllUsers({
          ...params,
          sortBy: params.sortBy as
            | "name"
            | "email"
            | "createdAt"
            | `-${"name" | "email" | "createdAt"}`,
          role: "USER",
          filterBy: params.filterBy as "All" | "Active" | "Inactive",
          includeDeleted:true
        })
      }
      columns={[
        {
          header: "Name",
          accessor: "name",
          render: (user) =>
            user.name ? <span>{user.name}</span> : <span className="text-gray-400">N/A</span>,
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
          label: (user) => (user.deletedAt ? "Unblock" : "Block"),
          onClick: (user) => toggleDeleteUser(user.id), 
          variant: (user) => (user.deletedAt ? "default" : "destructive"),
          confirmationMessage: (user) =>
            user.deletedAt
              ? `Are you sure you want to unblock the student "${
                  user.name || user.email
                }"?`
              : `Are you sure you want to block the student "${
                  user.name || user.email
                }"?`,
        },
      ]}
      stats={(students, total) => [
        { title: "Total Students", value: total },
        {
          title: "Active Students",
          value: students.filter((student) => !student.deletedAt).length,
          color: "text-green-600",
        },
        {
          title: "Inactive Students",
          value: students.filter((student) => student.deletedAt).length,
          color: "text-red-600",
        },
      ]}
      sortOptions={[
        { value: "name", label: "Name (A-Z)" },
        { value: "email", label: "Email (A-Z)" },
        { value: "createdAt", label: "Newest first" },
      ]}
      defaultSortBy="name"
      role="USER"
      filterOptions={[
        { label: "All", value: "All" },
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
      ]}
    />
  );
}
