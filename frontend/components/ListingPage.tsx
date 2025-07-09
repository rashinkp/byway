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
		<div className="min-h-screen bg-[var(--color-surface)]/50 p-6">
			<div className="max-w-7xl mx-auto space-y-8">
				{/* Header Section */}
				<div className="space-y-4">
					<div className="flex items-center gap-3">
						<div className="bg-[var(--color-primary-light)]/10 p-2 rounded-lg">
							<BarChart3 className="w-6 h-6 text-[var(--color-primary-light)]" />
						</div>
						<div>
							<h1 className="text-2xl font-semibold text-[var(--color-primary-dark)]">{title}</h1>
							<p className="text-[var(--color-muted)]">{description}</p>
						</div>
					</div>
					<div className="flex items-center gap-4">
						<div className="flex space-x-2">
							{addButton && (
								<Button
									className="bg-[var(--color-primary-dark)] hover:bg-[var(--color-primary-light)] text-[var(--color-surface)]"
									onClick={addButton.onClick}
								>
									<Plus className="mr-2 h-5 w-5" />
									{addButton.label}
								</Button>
							)}
							{extraButtons && extraButtons.length > 0 && extraButtons}
						</div>
						<div className="bg-[var(--color-accent)]/10 px-3 py-1 rounded-full border border-[var(--color-accent)]/20">
							<div className="flex items-center text-[var(--color-accent)] text-sm">
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
					<div className="flex items-center justify-between pt-6 border-t border-[var(--color-muted)]">
						<div className="text-sm text-[var(--color-muted)]">
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
