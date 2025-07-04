"use client";

import { JSX, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, BarChart3, Activity } from "lucide-react";
import { StatsCards } from "@/components/ui/StatsCard";
import { TableControls } from "@/components/ui/TableControls";
import { Pagination } from "@/components/ui/Pagination";
import { StatsSkeleton } from "@/components/skeleton/StatsSkeleton";
import { TableSkeleton } from "@/components/skeleton/DataTableSkeleton";
import { PaginationSkeleton } from "@/components/skeleton/PaginationSkeleton";
import { DataTable } from "@/components/ui/DataTable";
import ErrorDisplay from "@/components/ErrorDisplay";
import { SortOption, Stat, Column, Action } from "@/types/common";

interface ListPageProps<T> {
	title: string;
	description: string;
	entityName: string;
	useDataHook: (params: {
		page: number;
		limit: number;
		search: string;
		sortBy: string;
		sortOrder: "asc" | "desc";
		includeDeleted: boolean;
		filterBy: string;
		role?: string;
	}) => {
		data: { items: T[]; total: number; totalPages: number } | undefined;
		isLoading: boolean;
		error: { message: string } | null;
		refetch: () => void;
	};
	columns: Column<T>[];
	actions: Action<T>[];
	stats: (items: T[], total: number) => Stat<T>[];
	sortOptions: SortOption<T>[];
	addButton?: {
		label: string;
		onClick: () => void;
	};
	extraButtons?: JSX.Element[];
	defaultSortBy: Extract<keyof T, string> | `-${string}`;
	itemsPerPage?: number;
	role?: string;
	filterOptions: Array<{ value: string; label: string }>;
}

function ListPage<T>({
	title,
	description,
	entityName,
	useDataHook,
	columns,
	actions,
	stats,
	sortOptions,
	addButton,
	extraButtons,
	defaultSortBy,
	itemsPerPage = 10,
	role,
	filterOptions,
}: ListPageProps<T>) {
	const [page, setPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState<string>("All");
	const [sortBy, setSortBy] = useState<string>(defaultSortBy);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

	console.log(filterStatus, "filter status ------------->");

	const { data, isLoading, error, refetch } = useDataHook({
		page,
		limit: itemsPerPage,
		search: searchTerm,
		sortBy,
		sortOrder,
		includeDeleted: filterStatus === "Inactive" || filterStatus === "Declined",
		filterBy: filterStatus,
		role,
	});

	const items = data?.items || [];
	const total = data?.total || 0;
	const totalPages = data?.totalPages || 0;

	if (error) {
		return (
			<ErrorDisplay
				title={`${entityName} Error`}
				description={`${entityName} error occurred. Please try again`}
				error={error}
				onRetry={() => refetch()}
			/>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50/50 p-6">
			<div className="max-w-7xl mx-auto space-y-8">
				{/* Header Section */}
				<div className="space-y-4">
					<div className="flex items-center gap-3">
						<div className="bg-blue-50 p-2 rounded-lg">
							<BarChart3 className="w-6 h-6 text-blue-600" />
						</div>
						<div>
							<h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
							<p className="text-gray-600">{description}</p>
						</div>
					</div>
					<div className="flex items-center gap-4">
						<div className="flex space-x-2">
							{addButton && (
								<Button
									className="bg-blue-600 hover:bg-blue-700 text-white"
									onClick={addButton.onClick}
								>
									<Plus className="mr-2 h-5 w-5" />
									{addButton.label}
								</Button>
							)}
							{extraButtons && extraButtons.length > 0 && extraButtons}
						</div>
						<div className="bg-green-50 px-3 py-1 rounded-full border border-green-200">
							<div className="flex items-center text-green-700 text-sm">
								<Activity className="w-3 h-3 mr-1" />
								Live Data
							</div>
						</div>
					</div>
				</div>

				{/* Stats Cards */}
				{isLoading ? (
					<StatsSkeleton count={3} />
				) : (
					<StatsCards stats={stats(items, total)} />
				)}

				{/* Table Controls */}
				<TableControls
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					filterStatus={filterStatus}
					setFilterStatus={(status: string) =>
						setFilterStatus(
							status as "All" | "Active" | "Inactive" | "Declined",
						)
					}
					sortBy={sortBy}
					setSortBy={setSortBy}
					sortOrder={sortOrder}
					setSortOrder={setSortOrder}
					sortOptions={sortOptions}
					onRefresh={refetch}
					filterTabs={filterOptions}
				/>

				{/* Data Table */}
				{isLoading ? (
					<TableSkeleton
						columns={columns.length}
						hasActions={actions.length > 0}
					/>
				) : (
					<DataTable
						data={items}
						columns={columns}
						isLoading={isLoading}
						actions={actions}
						itemsPerPage={itemsPerPage}
						totalItems={total}
						currentPage={page}
						setCurrentPage={setPage}
					/>
				)}

				{/* Pagination */}
				{isLoading ? (
					<PaginationSkeleton />
				) : totalPages > 1 ? (
					<div className="flex items-center justify-between pt-6 border-t border-gray-200">
						<div className="text-sm text-gray-500">
							Showing {(page - 1) * itemsPerPage + 1} to{" "}
							{Math.min(page * itemsPerPage, total)} of {total} results
						</div>
						<Pagination
							currentPage={page}
							totalPages={totalPages}
							onPageChange={setPage}
						/>
					</div>
				) : null}
			</div>
		</div>
	);
}

export default ListPage;
