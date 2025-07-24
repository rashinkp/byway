"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { useGetAllCourses } from "@/hooks/course/useGetAllCourse";
import ListPage from "@/components/ListingPage";
import { Course } from "@/types/course";
import { CourseFormModal } from "@/components/course/CourseFormModal";
import { useRouter } from "next/navigation";

export default function InstructorCoursesPage() {
	const router = useRouter();
	const [page, setPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState<string>("All");
	const [sortBy, setSortBy] = useState<string>("title");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const [isModalOpen, setIsModalOpen] = useState(false);

	const coursesQuery = useGetAllCourses({
		page,
		limit: 10,
		search: searchTerm,
		sortBy: (["title", "price", "createdAt"] as const).includes(sortBy as any) ? (sortBy as "title" | "price" | "createdAt") : "title",
		sortOrder,
		includeDeleted: filterStatus === "Inactive",
		filterBy: (["All", "Active", "Inactive", "Approved", "Declined", "Pending", "Published", "Draft", "Archived"] as const).includes(filterStatus as any) ? (filterStatus as "All" | "Active" | "Inactive" | "Approved" | "Declined" | "Pending" | "Published" | "Draft" | "Archived") : "All",
	});

	return (
		<>
			<ListPage<Course>
				title="Instructor Course Management"
				description="Manage your courses and their visibility"
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
								<span className="font-medium">{course.title}</span>
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
					{
						header: "Price",
						accessor: "price",
						render: (course: Course) => (
							<span className="font-medium">
								${Number(course.price).toFixed(2)}
							</span>
						),
					},
					{
						header: "Created",
						accessor: "createdAt",
						render: (course: Course) => (
							<span className="">
								{new Date(course.createdAt).toLocaleDateString()}
							</span>
						),
					},
				]}
				actions={[
					{
						label: "View Details",
						onClick: (course: Course) =>
							router.push(`/instructor/courses/${course.id}`),
						variant: "outline",
						Icon: Info,
					},
				]}
				stats={(courses: Course[], total: number) => [
					{
						title: "Total Courses",
						value: total,
						icon: "list",
					},
					{
						title: "Published Courses",
						value: courses.filter(
							(course) => course.status === "PUBLISHED",
						).length,
						icon: "check",
					},
					{
						title: "Draft Courses",
						value: courses.filter((course) => course.status === "DRAFT")
							.length,
						icon: "book",
					},
					{
						title: "Approved Courses",
						value: courses.filter(
							(course) => course.approvalStatus === "APPROVED",
						).length,
						icon: "check",
					},
					{
						title: "Pending Approval",
						value: courses.filter(
							(course) => course.approvalStatus === "PENDING",
						).length,
						icon: "clock",
					},
					{
						title: "Declined Courses",
						value: courses.filter(
							(course) => course.approvalStatus === "DECLINED",
						).length,
						icon: "alert",
					},
				]}
				sortOptions={[
					{ value: "title", label: "Title" },
					{ value: "createdAt", label: "Date" },
					{ value: "price", label: "Price" },
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
				addButton={{
					label: "Create Course",
					onClick: () => setIsModalOpen(true),
				}}
			/>
			<CourseFormModal open={isModalOpen} onOpenChange={setIsModalOpen} />
		</>
	);
}
