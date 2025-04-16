"use client";

import { useState, useEffect } from "react";
import CategoryList from "@/components/admin/CategoryListing";
import CategoryFormModal from "@/components/admin/CategoryFormModal";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useToggleDeleteCategory,
} from "@/hooks/useCategory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, RefreshCcw, Filter } from "lucide-react";
import { Category, CategoryFormData } from "@/types/category";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";



//todo remove unnecessory request if there is no change don't neeed any request to backend

//todo: pagination and backend search from pagination;


export default function CategoriesPage() {
  const { categories, setCategories, loading, refetch } = useCategories();
  const { createCategory } = useCreateCategory();
  const { updateCategory } = useUpdateCategory();
  const { toggleDeleteCategory } = useToggleDeleteCategory();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | undefined>(
    undefined
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // Filtered and sorted categories
  const filteredCategories = categories
    .filter((category) => {
      // Search filter
      const matchesSearch =
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description &&
          category.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      // Status filter
      let matchesStatus = true;
      if (filterStatus === "active") {
        matchesStatus = !category.deletedAt;
      } else if (filterStatus === "inactive") {
        matchesStatus = Boolean(category.deletedAt);
      }

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "newest")
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      if (sortBy === "oldest")
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      if (sortBy === "courses")
        return (b.courseCount || 0) - (a.courseCount || 0);
      return 0;
    });

  // Stats calculation
  const totalCategories = categories.length;
  const activeCategories = categories.filter((cat) => !cat.deletedAt).length;
  const inactiveCategories = categories.filter((cat) => cat.deletedAt).length;
  const totalCourses = categories.reduce(
    (sum, cat) => sum + (cat.courseCount || 0),
    0
  );

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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Active Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeCategories}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Inactive Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {inactiveCategories}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalCourses}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-3 w-64">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>

        <div className="flex items-center justify-between mt-4 mb-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search categories..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="flex items-center gap-1"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Filter className="h-4 w-4" />
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={sortBy}
                  onValueChange={setSortBy}
                >
                  <DropdownMenuRadioItem value="name">
                    Name (A-Z)
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="newest">
                    Newest first
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="oldest">
                    Oldest first
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="courses">
                    Most courses
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <TabsContent value="all">
          <CategoryList
            categories={filteredCategories}
            onEdit={handleEdit}
            onToggleDelete={handleToggleDelete}
            isLoading={loading}
          />
        </TabsContent>
        <TabsContent value="active">
          <CategoryList
            categories={filteredCategories.filter((cat) => !cat.deletedAt)}
            onEdit={handleEdit}
            onToggleDelete={handleToggleDelete}
            isLoading={loading}
          />
        </TabsContent>
        <TabsContent value="inactive">
          <CategoryList
            categories={filteredCategories.filter((cat) => cat.deletedAt)}
            onEdit={handleEdit}
            onToggleDelete={handleToggleDelete}
            isLoading={loading}
          />
        </TabsContent>
      </Tabs>

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
