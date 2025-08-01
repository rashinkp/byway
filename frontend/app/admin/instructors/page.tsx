"use client";
import { IInstructorWithUserDetails } from "@/types/instructor";
import { useGetAllInstructors } from "@/hooks/instructor/useGetAllInstructor";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/ui/StatusBadge";

import ListPage from "@/components/ListingPage";
import { Column, SortOption, Action } from "@/types/common";
import { useState } from "react";

export default function InstructorsPage() {
	const router = useRouter();

	const [page, setPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState<string>("All");
	const [sortBy, setSortBy] = useState<string>("createdAt");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

	const instructorsQuery = useGetAllInstructors({
		page,
		limit: 10,
		search: searchTerm,
		sortBy: (["createdAt", "status", "areaOfExpertise", "user"] as const).includes(sortBy as any) ? (sortBy as "createdAt" | "status" | "areaOfExpertise" | "user") : "createdAt",
		sortOrder,
		includeDeleted: filterStatus === "Inactive" || filterStatus === "All",
		filterBy: (["All", "Pending", "Approved", "Declined"] as const).includes(filterStatus as any) ? (filterStatus as "All" | "Pending" | "Approved" | "Declined") : "All",
	});

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
			header: "Approval Status",
			accessor: "status",
			render: (instructor) => (
				<div
					className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
						instructor.status === "APPROVED"
							? "bg-green-100 text-green-800"
							: instructor.status === "PENDING"
								? "bg-yellow-100 text-yellow-800"
								: instructor.status === "DECLINED"
									? "bg-red-100 text-red-800"
									: "bg-gray-100 text-gray-800"
					}`}
				>
					{instructor.status}
				</div>
			),
		},
		{
			header: "Account Status",
			accessor: "user",
			render: (instructor) => (
				<StatusBadge isActive={!instructor.user.deletedAt} />
			),
		},
	];

	const actions: Action<IInstructorWithUserDetails>[] = [
		{
			label: "View Details",
			onClick: (instructor) =>
				router.push(`/admin/instructors/${instructor.user.id}`),
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
			data={instructorsQuery.data ? instructorsQuery.data.data : undefined}
			isLoading={instructorsQuery.isLoading}
			error={instructorsQuery.error}
			refetch={instructorsQuery.refetch}
			page={page}
			setPage={setPage}
			searchTerm={searchTerm}
			setSearchTerm={setSearchTerm}
			filterStatus={filterStatus}
			setFilterStatus={setFilterStatus}
			sortBy={sortBy}
			setSortBy={setSortBy}
			sortOrder={sortOrder}
			setSortOrder={setSortOrder}
			columns={columns}
			actions={actions}
			stats={(instructors, total) => [
				{ title: "Total Instructors", value: total },
				{
					title: "Active Instructors",
					value: instructors.filter((instructor) => !instructor.user.deletedAt).length,
					color: "text-green-600",
				},
				{
					title: "Inactive Instructors",
					value: instructors.filter((instructor) => instructor.user.deletedAt).length,
					color: "text-red-600",
				},
				{
					title: "Pending Approvals",
					value: instructors.filter((instructor) => instructor.status === "PENDING").length,
					color: "text-yellow-600",
				},
				{
					title: "Declined Requests",
					value: instructors.filter((instructor) => instructor.status === "DECLINED").length,
					color: "text-red-600",
				},
			]}
			sortOptions={sortOptions}
			filterOptions={[
				{ label: "All", value: "All" },
				{ label: "Pending", value: "Pending" },
				{ label: "Approved", value: "Approved" },
				{ label: "Declined", value: "Declined" },
			]}
		/>
	);
}
