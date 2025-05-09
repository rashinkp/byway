"use client";

import { JSX, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { StatsCards } from "@/components/ui/StatsCard";
import { TableControls } from "@/components/ui/TableControls";
import { StatusBadge } from "@/components/ui/StatusBadge";
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
    filterBy: "All" | "Active" | "Inactive";
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
}: ListPageProps<T>) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Active" | "Inactive"
  >("All");
  const [sortBy, setSortBy] = useState<string>(defaultSortBy);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { data, isLoading, error, refetch } = useDataHook({
    page,
    limit: itemsPerPage,
    search: searchTerm,
    sortBy,
    sortOrder,
    includeDeleted: true,
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-500 mt-1">{description}</p>
        </div>
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
          {extraButtons}
        </div>
      </div>

      {isLoading ? (
        <StatsSkeleton count={3} />
      ) : (
        <StatsCards stats={stats(items, total)} />
      )}

      <TableControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={(status: string) =>
          setFilterStatus(status as "All" | "Active" | "Inactive")
        }
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        sortOptions={sortOptions}
        onRefresh={refetch}
      />

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

      {isLoading ? (
        <PaginationSkeleton />
      ) : totalPages > 1 ? (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      ) : null}
    </div>
  );
}

export default ListPage;
