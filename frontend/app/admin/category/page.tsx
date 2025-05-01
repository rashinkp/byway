"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Category, CategoryFormData } from "@/types/category";
import { useCategories } from "@/hooks/category/useCategories";
import { useCreateCategory } from "@/hooks/category/useCreateCategory";
import { useUpdateCategory } from "@/hooks/category/useUpdateCategory";
import { useToggleDeleteCategory } from "@/hooks/category/useToggleDeleteCategory";
import CategoryFormModal from "@/components/admin/CategoryFormModal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import ListPage from "@/components/ListingPage";

export default function CategoriesPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | undefined>(
    undefined
  );

  const { mutate: createCategory } = useCreateCategory();
  const { mutate: updateCategory } = useUpdateCategory();
  const { mutate: toggleDeleteCategory } = useToggleDeleteCategory();

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

  return (
    <>
      <ListPage<Category>
        title="Category Management"
        description="Manage course categories and their settings"
        entityName="Category"
        useDataHook={(params) =>
          useCategories({
            ...params,
            sortBy: params.sortBy as
              | "name"
              | "createdAt"
              | "updatedAt"
              | `-${"name" | "createdAt" | "updatedAt"}`,
          })
        }
        columns={[
          {
            header: "Name",
            accessor: "name",
          },
          {
            header: "Description",
            accessor: "description",
            render: (category) =>
              category.description ? (
                <span>{category.description}</span>
              ) : (
                <span className="text-gray-400">N/A</span>
              ),
          },
          {
            header: "Status",
            accessor: "deletedAt",
            render: (category) => (
              <StatusBadge isActive={!category.deletedAt} />
            ),
          },
        ]}
        actions={[
          {
            label: "Edit",
            onClick: (category) => {
              setEditCategory(category);
              setIsEditOpen(true);
            },
            variant: "outline",
          },
          {
            label: (category) => (category.deletedAt ? "Enable" : "Disable"),
            onClick: (category) => toggleDeleteCategory(category),
            variant: (category) =>
              category.deletedAt ? "default" : "destructive",
            confirmationMessage: (category) =>
              category.deletedAt
                ? `Are you sure you want to enable the category "${category.name}"?`
                : `Are you sure you want to disable the category "${category.name}"?`,
          },
        ]}
        stats={(categories, total) => [
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
        ]}
        sortOptions={[
          { value: "name", label: "Name" },
          { value: "createdAt", label: "Created At" },
        ]}
        addButton={{
          label: "Add Category",
          onClick: () => setIsAddOpen(true),
        }}
        defaultSortBy="name"
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
    </>
  );
}
