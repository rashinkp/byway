"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Category, CategoryFormData } from "@/types/category";
import { StatsCards } from "@/components/ui/StatsCard";
import { TableControls } from "@/components/ui/TableControls";
import { useCategories } from "@/hooks/category/useCategories";
import { useCreateCategory } from "@/hooks/category/useCreateCategory";
import { useUpdateCategory } from "@/hooks/category/useUpdateCategory";
import { useToggleDeleteCategory } from "@/hooks/category/useToggleDeleteCategory";
import CategoryFormModal from "@/components/admin/CategoryFormModal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Pagination } from "@/components/ui/Pagination";
import { StatsSkeleton } from "@/components/skeleton/StatsSkeleton";
import { TableSkeleton } from "@/components/skeleton/DataTableSkeleton";
import { DataTable } from "@/components/ui/DataTable";
import { PaginationSkeleton } from "@/components/skeleton/PaginationSkeleton";
import ErrorDisplay from "@/components/ErrorDisplay";

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"All" | "Active" | "Inactive">("All");
  const [sortBy, setSortBy] = useState<"name" | "createdAt" | "updatedAt">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | undefined>(undefined);

  const { categories, total, totalPages, loading: isLoading, error, refetch } = useCategories({
    page,
    limit: 10,
    search: searchTerm,
    includeDeleted: true,
    sortOrder,
    sortBy,
    filterBy: filterStatus,
  });

  const { mutate: createCategory } = useCreateCategory();
  const { mutate: updateCategory } = useUpdateCategory();
  const { mutate: toggleDeleteCategory } = useToggleDeleteCategory();

  const stats = [
    { title: "Total Categories", value: total },
    {
      title: "Active Categories",
      value: categories.filter((cat) => !cat.deletedAt).length,
      color: "text-green-600",
    },
    {
      title: "Inactive Categories",
      value: categories.filter((cat) => cat.deletedAt).length,
      color: "text-red-600",
    },
  ];

  const columns = [
    {
      header: "Name",
      accessor: "name" as keyof Category,
    },
    {
      header: "Description",
      accessor: "description" as keyof Category,
      render: (category: Category) =>
        category.description || <span className="text-gray-400">N/A</span>,
    },
    {
      header: "Status",
      accessor: "deletedAt" as keyof Category,
      render: (category: Category) => <StatusBadge isActive={!category.deletedAt} />,
    },
  ];

  const actions = [
    {
      label: "Edit",
      onClick: (category: Category) => {
        setEditCategory(category);
        setIsEditOpen(true);
      },
    },
    {
      label: (category: Category) => (category.deletedAt ? "Enable" : "Disable"),
      onClick: (category: Category) => toggleDeleteCategory(category),
      variant: (category: Category) => (category.deletedAt ? "default" : "destructive"),
      confirmationMessage: (category: Category) =>
        category.deletedAt
          ? `Are you sure you want to enable the category "${category.name}"?`
          : `Are you sure you want to disable the category "${category.name}"?`,
    },
  ];

  const handleAddSubmit = async (data: CategoryFormData) => {
    createCategory(data, {
      onSuccess: () => setIsAddOpen(false),
    });
  };

  const handleEditSubmit = async (data: CategoryFormData) => {
    if (!editCategory) return;
    updateCategory(
      { id: editCategory.id, data },
      {
        onSuccess: () => {
          setIsEditOpen(false);
          setEditCategory(undefined);
        },
      }
    );
  };

  if (error) {
    return (
      <ErrorDisplay
        title="Category Error"
        description="Error occured while working with category"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Category Management</h1>
        <p className="text-gray-500 mt-1">Manage course categories and their settings</p>
        </div>
        <Button
          className="bg-black hover:bg-black-700 text-white"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Category
        </Button>
      </div>

      {isLoading ? <StatsSkeleton count={3} /> : <StatsCards stats={stats} />}

      <TableControls<"name" | "createdAt" | "updatedAt">
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
        sortOptions={[
          { value: "name", label: "Name" },
          { value: "createdAt", label: "Created At" },
        ]}
        onRefresh={refetch}
      />

      {isLoading ? (
        <TableSkeleton columns={3} hasActions={true} />
      ) : (
        <DataTable<Category>
          data={categories}
          columns={columns}
          isLoading={isLoading}
          actions={actions}
          itemsPerPage={10}
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

      <CategoryFormModal
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSubmit={handleAddSubmit}
        title="Add New Category"
        submitText="Save"
      />

      <CategoryFormModal
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) setEditCategory(undefined);
        }}
        onSubmit={handleEditSubmit}
        initialData={editCategory}
        title="Edit Category"
        submitText="Update"
      />
    </div>
  );
}