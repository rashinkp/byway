"use client";

import { useState } from "react";
import CategoryList from "@/components/admin/CategoryListing";
import CategoryFormModal from "@/components/admin/CategoryFormModal";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useToggleDeleteCategory,
} from "@/hooks/useCategory";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Category, CategoryFormData } from "@/types/category";

export default function CategoriesPage() {
  const { categories, setCategories } = useCategories();
  const { createCategory } = useCreateCategory();
  const { updateCategory } = useUpdateCategory();
  const { toggleDeleteCategory } = useToggleDeleteCategory();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | undefined>(undefined);

  console.log(categories);

  const handleAddSubmit = async (data: CategoryFormData) => {
    const newCategory = await createCategory(data);
    setCategories([...categories, newCategory]);
    setIsAddOpen(false);
  };

  

  const handleEditSubmit = async (data: CategoryFormData) => {
    if (!editCategory) return;
    const updatedCategory = await updateCategory(editCategory.id, data);
    setCategories(
      categories.map((cat) =>
        cat.id === editCategory.id ? updatedCategory : cat
      )
    );
    setIsEditOpen(false);
    setEditCategory(undefined);
  };

  const handleEdit = (category: Category) => {
    setEditCategory(category);
    setIsEditOpen(true);
  };

  const handleToggleDelete = async (category: Category) => {
    try {
      const updatedCategory = await toggleDeleteCategory(category);
      if (updatedCategory && updatedCategory.id) {
        setCategories((prev) =>
          prev.map((cat) => (cat.id === category.id ? updatedCategory : cat))
        );
      } else {
        console.warn("Invalid updatedCategory:", updatedCategory);
      }
    } catch (error) {
      console.error("Failed to toggle delete:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Category Management
        </h1>
        <Button className="auth-button" onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-5 w-5" />
          Add Category
        </Button>
      </div>

      <CategoryList
        categories={categories}
        onEdit={handleEdit}
        onToggleDelete={handleToggleDelete}
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
