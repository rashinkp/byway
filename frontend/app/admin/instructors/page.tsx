"use client";
import { IInstructorWithUserDetails } from "@/types/instructor";
import { useGetAllInstructors } from "@/hooks/instructor/useGetAllInstructor";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { StatusBadge } from "@/components/ui/StatusBadge";

import ListPage from "@/components/ListingPage";
import { Column, SortOption, Action } from "@/types/common";

export default function InstructorsPage() {
	const router = useRouter();

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
			useDataHook={params => {
				const validSortBy = ["createdAt", "status", "areaOfExpertise", "user"] as const;
				const sortBy = validSortBy.includes(params.sortBy as typeof validSortBy[number])
					? (params.sortBy as typeof validSortBy[number])
					: "createdAt";
				const validFilterBy = ["All", "Pending", "Approved", "Declined"] as const;
				const filterBy = validFilterBy.includes(params.filterBy as typeof validFilterBy[number])
					? (params.filterBy as typeof validFilterBy[number])
					: "All";
				const query = useGetAllInstructors({ ...params, sortBy, filterBy });

				return {
					data: query.data
						? {
							items: query.data.data.items,
							total: query.data.data.total,
							totalPages: query.data.data.totalPages,
						}
						: undefined,
					isLoading: query.isLoading,
					error: query.error ? { message: query.error.message } : null,
					refetch: query.refetch,
				};
			}}
			columns={columns}
			actions={actions}
			stats={(instructors, total) => [
				{ title: "Total Instructors", value: total },
				{
					title: "Active Instructors",
					value: instructors.filter((instructor) => !instructor.user.deletedAt)
						.length,
					color: "text-green-600",
				},
				{
					title: "Inactive Instructors",
					value: instructors.filter((instructor) => instructor.user.deletedAt)
						.length,
					color: "text-red-600",
				},
				{
					title: "Pending Approvals",
					value: instructors.filter(
						(instructor) => instructor.status === "PENDING",
					).length,
					color: "text-yellow-600",
				},
				{
					title: "Declined Requests",
					value: instructors.filter(
						(instructor) => instructor.status === "DECLINED",
					).length,
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
