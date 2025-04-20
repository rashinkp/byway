"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Category, CategoryFormData } from "@/types/category";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/DataTable";
import { StatsCards } from "@/components/ui/StatsCard";
import { TableControls } from "@/components/ui/TableControls";
import { useCategories } from "@/hooks/category/useCategories";
import { useCreateCategory } from "@/hooks/category/useCreateCategory";
import { useUpdateCategory } from "@/hooks/category/useUpdateCategory";
import { useToggleDeleteCategory } from "@/hooks/category/useToggleDeleteCategory";
import CategoryFormModal from "@/components/admin/CategoryFormModal";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { categories, total, loading, refetch, setCategories } = useCategories({
    page,
    limit: 10,
    search: searchTerm,
    includeDeleted: true,
    
  });
  const { mutate: createCategory } = useCreateCategory();
  const { mutate: updateCategory } = useUpdateCategory();
  const { mutate: toggleDeleteCategory } = useToggleDeleteCategory();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | undefined>(
    undefined
  );
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const stats = [
    { title: "Total Categories", value: total },
    {
      title: "Active Categories",
      value: categories.filter((cat) => cat.deletedAt).length,
      color: "text-green-600",
    },
    {
      title: "Inactive Categories",
      value: categories.filter((cat) => cat.deletedAt).length,
      color: "text-red-600",
    },
  ];

  // Table columns
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
      accessor: "isDeleted" as keyof Category,
      render: (category: Category) => (
        <StatusBadge isActive={!category.deletedAt} />
      ),
    },
  ];

  // Actions
  const actions = [
    {
      label: "Edit",
      onClick: (category: Category) => {
        setEditCategory(category);
        setIsEditOpen(true);
      },
    },
    {
      label: (category: Category) =>
        category.deletedAt ? "Restore" : "Delete",
      onClick: (category: Category) => handleToggleDelete(category),
      variant: (category: Category) =>
        category.deletedAt ? "default" : "destructive",
    },
  ];

  const handleAddSubmit = async (data: CategoryFormData) => {
    createCategory(data, {
      onSuccess: () => setIsAddOpen(false),
    });
  };

  const handleEditSubmit = async (data: CategoryFormData) => {
    console.log(editCategory)
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

  const handleToggleDelete = async (category: Category) => {
    toggleDeleteCategory(category);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Category Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage course categories and their settings
          </p>
        </div>
        <Button
          className="bg-black hover:bg-black-700 text-white"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Category
        </Button>
      </div>

      <StatsCards stats={stats} />

      <TableControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOptions={[
          { value: "name", label: "Name (A-Z)" },
          { value: "newest", label: "Newest first" },
          { value: "oldest", label: "Oldest first" },
          // Remove courses if backend doesn't support courseCount
          { value: "courses", label: "Most courses" },
        ]}
        onRefresh={refetch}
      />

      <DataTable<Category>
        data={categories}
        columns={columns}
        isLoading={loading}
        actions={actions}
        itemsPerPage={10}
        totalItems={total}
        currentPage={page}
        setCurrentPage={setPage}
      />

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
