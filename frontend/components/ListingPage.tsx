"use client";

import { JSX } from "react";
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
	data: { items: T[]; total: number; totalPages: number } | undefined;
	isLoading: boolean;
	error: { message: string } | null;
	refetch: () => void;
	columns: Column<T>[];
	actions: Action<T>[];
	stats: (items: T[], total: number) => Stat[];
	sortOptions: SortOption<T>[];
	addButton?: {
		label: string;
		onClick: () => void;
	};
	extraButtons?: JSX.Element[];
	itemsPerPage?: number;
	filterOptions: Array<{ value: string; label: string }>;
	page: number;
	setPage: (page: number) => void;
	searchTerm: string;
	setSearchTerm: (term: string) => void;
	filterStatus: string;
	setFilterStatus: (status: string) => void;
	sortBy: string;
	setSortBy: (sortBy: string) => void;
	sortOrder: "asc" | "desc";
	setSortOrder: (order: "asc" | "desc") => void;
	actionLoading?: boolean;
}

function ListPage<T>({
	title,
	description,
	entityName,
	data,
	isLoading,
	error,
	refetch,
	columns,
	actions,
	stats,
	sortOptions,
	addButton,
	extraButtons,
	itemsPerPage = 10,
	filterOptions,
	page,
	setPage,
	searchTerm,
	setSearchTerm,
	filterStatus,
	setFilterStatus,
	sortBy,
	setSortBy,
	sortOrder,
	setSortOrder,
	actionLoading = false,
}: ListPageProps<T>) {
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
		<div className="min-h-screen bg-white/80 p-6 dark:bg-[#18181b]">
			<div className="max-w-7xl mx-auto space-y-8">
				{/* Header Section */}
				<div className="space-y-4">
					<div className="flex items-center gap-3">
						<div className="bg-[#facc15]/10 p-2 rounded-lg dark:bg-[#232323]">
							<BarChart3 className="w-6 h-6 text-[#facc15] dark:text-[#facc15]" />
						</div>
						<div>
							<h1 className="text-2xl font-semibold text-black dark:text-white">{title}</h1>
							<p className="text-gray-700 dark:text-gray-300">{description}</p>
						</div>
					</div>
					<div className="flex items-center gap-4">
						<div className="flex space-x-2">
							{addButton && (
								<Button
									className="bg-[#18181b] hover:bg-[#facc15] text-white dark:bg-[#facc15] dark:text-black dark:hover:bg-[#18181b] dark:hover:text-[#facc15]"
									onClick={addButton.onClick}
								>
									<Plus className="mr-2 h-5 w-5" />
									{addButton.label}
								</Button>
							)}
							{extraButtons && extraButtons.length > 0 && extraButtons}
						</div>
						<div className="bg-[#facc15]/10 px-3 py-1 rounded-full border border-[#facc15]/20 dark:bg-[#232323] dark:border-[#facc15]/20">
							<div className="flex items-center text-yellow-700 dark:text-[#facc15] text-sm">
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
					setFilterStatus={setFilterStatus}
					sortBy={sortBy}
					setSortBy={setSortBy}
					sortOrder={sortOrder}
					setSortOrder={setSortOrder}
					sortOptions={sortOptions as SortOption<unknown>[]}
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
						actionLoading={actionLoading}
					/>
				)}

				{/* Pagination */}
				{isLoading ? (
					<PaginationSkeleton />
				) : totalPages > 1 ? (
					<div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
						<div className="text-sm text-gray-700 dark:text-gray-300">
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
