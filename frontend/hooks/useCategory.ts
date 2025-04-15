import { useState, useEffect } from "react";
import { toast } from "sonner";
import {api} from "@/lib/api";
import { Category, CategoryFormData } from "@/types/category";

// Fetch categories
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        "/category/admin/categories?includeDeleted=true"
      );
      setCategories(response.data.data.categories);
    } catch (error: any) {
      toast.error("Failed to fetch categories", {
        description: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, setCategories, loading, refetch: fetchCategories };
}

// Create category
export function useCreateCategory() {
  const [loading, setLoading] = useState(false);

  const createCategory = async (data: CategoryFormData) => {
    setLoading(true);
    try {
      const response = await api.post("/category/admin/categories", data);
      toast.success("Category added", {
        description: `${data.name} created successfully`,
      });
      return response.data.data as Category;
    } catch (error: any) {
      toast.error("Failed to add category", {
        description: error.response?.data?.message || "Something went wrong",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { createCategory, loading };
}

// Update category
export function useUpdateCategory() {
  const [loading, setLoading] = useState(false);

  const updateCategory = async (id: string, data: CategoryFormData) => {
    setLoading(true);
    try {
      const response = await api.patch(`/categories/${id}`, data);
      toast.success("Category updated", {
        description: `${data.name} updated successfully`,
      });
      return response.data.data as Category;
    } catch (error: any) {
      toast.error("Failed to update category", {
        description: error.response?.data?.message || "Something went wrong",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { updateCategory, loading };
}

// Toggle delete category
export function useToggleDeleteCategory() {
  const [loading, setLoading] = useState(false);

  const toggleDeleteCategory = async (category: Category) => {
    setLoading(true);
    try {
      const response = await api.delete(`/category/admin/categories/${category.id}`);
      toast.success(
        category.deletedAt !== null ? "Category deleted" : "Category restored",
        {
          description: `${category.name} ${
            category.deletedAt !== null ? "deleted" : "restored"
          } successfully`,
        }
      );
      return response.data.data as Category;
    } catch (error: any) {
      toast.error(
        category.deletedAt !== null
          ? "Failed to delete category"
          : "Failed to restore category",
        {
          description: error.response?.data?.message || "Something went wrong",
        }
      );
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { toggleDeleteCategory, loading };
}
