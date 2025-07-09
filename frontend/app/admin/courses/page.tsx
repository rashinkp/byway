"use client";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
import { useGetAllCourses } from "@/hooks/course/useGetAllCourse";
import { useGetCourseStats } from "@/hooks/course/useGetCourseStats";
import ListPage from "@/components/ListingPage";
import { Course } from "@/types/course";
import { useAuth } from "@/hooks/auth/useAuth";
import { useState } from "react";

export default function CoursesPage() {
	const { user } = useAuth();
	const router = useRouter();
	const { data: statsData } = useGetCourseStats();

	const [page, setPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState<string>("All");
	const [sortBy, setSortBy] = useState<string>("title");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

	const coursesQuery = useGetAllCourses({
		page,
		limit: 10,
		search: searchTerm,
		sortBy: (["title", "price", "createdAt"] as const).includes(sortBy as any) ? (sortBy as "title" | "price" | "createdAt") : "title",
		sortOrder,
		role: user?.role || "ADMIN",
		includeDeleted: filterStatus === "Inactive",
		filterBy: (["All", "Active", "Inactive", "Approved", "Declined", "Pending", "Published", "Draft", "Archived"] as const).includes(filterStatus as any) ? (filterStatus as "All" | "Active" | "Inactive" | "Approved" | "Declined" | "Pending" | "Published" | "Draft" | "Archived") : "All",
	});

	return (
		<ListPage<Course>
			title="Course Management"
			description="Manage courses and their visibility"
			entityName="Course"
			data={coursesQuery.data}
			isLoading={coursesQuery.isLoading}
			error={coursesQuery.error}
			refetch={coursesQuery.refetch}
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
			columns={[
				{
					header: "Title",
					accessor: "title",
					render: (course: Course) =>
						course.title ? (
							<span>{course.title}</span>
						) : (
							<span className="text-gray-400">N/A</span>
						),
				},
				{
					header: "Approval Status",
					accessor: "approvalStatus",
					render: (course: Course) => (
						<div
							className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
								course.approvalStatus === "APPROVED"
									? "bg-green-100 text-green-800"
									: course.approvalStatus === "PENDING"
										? "bg-yellow-100 text-yellow-800"
										: course.approvalStatus === "DECLINED"
											? "bg-red-100 text-red-800"
											: "bg-gray-100 text-gray-800"
							}`}
						>
							{course.approvalStatus}
						</div>
					),
				},
				{
					header: "Publish Status",
					accessor: "status",
					render: (course: Course) => (
						<div
							className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
								course.status === "PUBLISHED"
									? "bg-blue-100 text-blue-800"
									: course.status === "DRAFT"
										? "bg-gray-100 text-gray-800"
										: course.status === "ARCHIVED"
											? "bg-orange-100 text-orange-800"
											: "bg-gray-100 text-gray-800"
							}`}
						>
							{course.status}
						</div>
					),
				},
			]}
			actions={[
				{
					label: "View Details",
					onClick: (course: Course) =>
						router.push(`/admin/courses/${course.id}`),
					variant: "outline",
					Icon: Info,
				},
			]}
			stats={() =>
				statsData
					? [
							{
								title: "Total Courses",
								value: statsData.totalCourses,
								icon: "list",
							},
							{
								title: "Active Courses",
								value: statsData.activeCourses,
								icon: "check",
							},
							{
								title: "Inactive Courses",
								value: statsData.inactiveCourses,
								icon: "x",
							},
							{
								title: "Approved Courses",
								value: statsData.approvedCourses,
								icon: "check",
							},
							{
								title: "Pending Approvals",
								value: statsData.pendingCourses,
								icon: "clock",
							},
							{
								title: "Declined Courses",
								value: statsData.declinedCourses,
								icon: "alert",
							},
							{
								title: "Published Courses",
								value: statsData.publishedCourses,
								icon: "book",
							},
							{
								title: "Draft Courses",
								value: statsData.draftCourses,
								icon: "book",
							},
							{
								title: "Archived Courses",
								value: statsData.archivedCourses,
								icon: "book",
							},
						]
					: []
			}
			sortOptions={[
				{ value: "title", label: "Title" },
				{ value: "createdAt", label: "Date" },
			]}
			filterOptions={[
				{ label: "All", value: "All" },
				{ label: "Active", value: "Active" },
				{ label: "Inactive", value: "Inactive" },
				{ label: "Approved", value: "Approved" },
				{ label: "Declined", value: "Declined" },
				{ label: "Pending", value: "Pending" },
				{ label: "Published", value: "Published" },
				{ label: "Draft", value: "Draft" },
				{ label: "Archived", value: "Archived" },
			]}
		/>
	);
}
