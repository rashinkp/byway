"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/DataTable";
import { TableControls } from "@/components/ui/TableControls";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Video } from "lucide-react";
import { LessonFormModal } from "./LessonFormModal";
import { useGetAllLessonsInCourse } from "@/hooks/lesson/useGetAllLesson";
import { ILesson } from "@/types/lesson";
import { useRouter } from "next/navigation";
import { TableSkeleton } from "../skeleton/DataTableSkeleton";
import { PaginationSkeleton } from "../skeleton/PaginationSkeleton";
import { Pagination } from "../ui/Pagination";

export function LessonManager({ courseId }: { courseId: string }) {
	const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
	const [editingLesson, setEditingLesson] = useState<ILesson | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState<"title" | "createdAt" | "order">(
		"order",
	);
	const [page, setPage] = useState(1);
	const [filterStatus, setFilterStatus] = useState<
		"ALL" | "PUBLISHED" | "DRAFT" | "INACTIVE"
	>("ALL");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
	const limit = 10;

	const { data, isLoading, error, refetch } = useGetAllLessonsInCourse({
		courseId,
		page,
		limit,
		sortBy,
		sortOrder: sortOrder || "asc",
		search: searchTerm,
		filterBy: filterStatus,
		includeDeleted: true,
	});

	const totalPages = data?.totalPages || 1;

	const router = useRouter();

	const columns = [
		{
			header: "Title",
			accessor: "title" as keyof ILesson,
			render: (lesson: ILesson) =>
				lesson.title ? <span>{lesson.title}</span> : <span className="text-gray-400">N/A</span>,
		},
		{
			header: "Description",
			accessor: "description" as keyof ILesson,
			render: (lesson: ILesson) =>
				lesson.description ? <span>{lesson.description}</span> : <span className="text-gray-400">N/A</span>,
		},
		{
			header: "Order",
			accessor: "order" as keyof ILesson,
			render: (lesson: ILesson) => <span>{lesson.order}</span>,
		},
		{
			header: "Status",
			accessor: "deletedAt" as keyof ILesson,
			render: (lesson: ILesson) => <StatusBadge isActive={!lesson.deletedAt} />,
		},
		{
			header: "Stage",
			accessor: "status" as keyof ILesson,
			render: (lesson: ILesson) => (
				<StatusBadge isActive={lesson.status === "PUBLISHED"} />
			),
		},
	];

	const actions = [
		{
			label: () => "View",
			onClick: (lesson: ILesson) =>
				router.push(
					`/instructor/courses/${lesson.courseId}/lessons/${lesson.id}`,
				),
			variant: () => "default" as const,
		},
	];

	if (error) {
		return (
			<div className="container mx-auto py-4">
				<p className="text-red-500">Error: {error.message}</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-bold text-gray-800">Lessons</h2>
				<Button
					onClick={() => {
						setEditingLesson(null);
						setIsLessonModalOpen(true);
					}}
					className="bg-blue-600 hover:bg-blue-700 text-white"
				>
					<Video className="mr-2 h-4 w-4" />
					Add Lesson
				</Button>
			</div>

			<TableControls
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				filterStatus={filterStatus}
				setFilterStatus={(status: string) => {
					setFilterStatus(status as "ALL" | "PUBLISHED" | "DRAFT" | "INACTIVE");
					setPage(1);
				}}
				sortBy={sortBy}
				setSortBy={(sort: string) =>
					setSortBy(sort as "title" | "createdAt" | "order")
				}
				sortOrder={sortOrder}
				setSortOrder={setSortOrder}
				sortOptions={[
					{ value: "title", label: "Title (A-Z)" },
					{ value: "order", label: "Order" },
					{ value: "createdAt", label: "Created At" },
				]}
				onRefresh={refetch}
				filterTabs={[
					{ value: "ALL", label: "All" },
					{ value: "PUBLISHED", label: "Published" },
					{ value: "DRAFT", label: "Draft" },
				]}
			/>

			{isLoading ? (
				<TableSkeleton columns={5} hasActions={true} />
			) : (
				<DataTable<ILesson>
					data={data?.lessons || []}
					columns={columns}
					isLoading={isLoading}
					actions={actions}
					itemsPerPage={limit}
					totalItems={data?.total || 0}
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

			<LessonFormModal
				open={isLessonModalOpen}
				onOpenChange={setIsLessonModalOpen}
				initialData={
					editingLesson
						? {
								title: editingLesson.title,
								description: editingLesson.description || "",
								order: editingLesson.order,
							}
						: undefined
				}
				courseId={courseId}
			/>
		</div>
	);
}
