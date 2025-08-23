"use client";

import { useState } from "react";
import { Category, CategoryFormData } from "@/types/category";
import { useCategories } from "@/hooks/category/useCategories";
import { useCreateCategory } from "@/hooks/category/useCreateCategory";
import { useUpdateCategory } from "@/hooks/category/useUpdateCategory";
import { useToggleDeleteCategory } from "@/hooks/category/useToggleDeleteCategory";
import CategoryFormModal from "@/components/admin/CategoryFormModal";
import { StatusBadge } from "@/components/ui/StatusBadge";
import ListPage from "@/components/ListingPage";
import { AlertComponent } from "@/components/ui/AlertComponent";

export default function CategoriesPage() {
	const [isAddOpen, setIsAddOpen] = useState(false);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [isViewOpen, setIsViewOpen] = useState(false);
	const [viewCategory, setViewCategory] = useState<Category | undefined>(
		undefined,
	);
	const [editCategory, setEditCategory] = useState<Category | undefined>(
		undefined,
	);

	const [page, setPage] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState<string>("All");
	const [sortBy, setSortBy] = useState<string>("name");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

	const categoriesQuery = useCategories({
		page,
		limit: 10,
		search: searchTerm,
		sortBy: (["name", "createdAt"] as const).includes(sortBy as "name" | "createdAt") ? (sortBy as "name" | "createdAt") : "name",
		sortOrder,
		includeDeleted: filterStatus === "Inactive" || filterStatus === "All",
		filterBy: (["All", "Active", "Inactive"] as const).includes(filterStatus as "All" | "Active" | "Inactive") ? (filterStatus as "All" | "Active" | "Inactive") : "All",

	});

	const { mutate: createCategory , isPending: isCreating } = useCreateCategory();
	const { mutate: updateCategory , isPending: isUpdating } = useUpdateCategory();
	const { mutate: toggleDeleteCategory , isPending: isDeleting } = useToggleDeleteCategory();

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
			},
		);
	};

	const handleViewCategory = (category: Category) => {		
		setViewCategory(category);
		setIsViewOpen(true);
	};

	const renderCategoryDetails = (category: Category) => (
		<div className="space-y-4">
			<div>
				<h3 className="text-sm font-semibold text-gray-700 dark:text-white">Name</h3>
				<p className="text-sm text-gray-600 dark:text-gray-300">{category.name}</p>
			</div>
			<div>
				<h3 className="text-sm font-semibold text-gray-700 dark:text-white">Description</h3>
				<p className="text-sm text-gray-600 dark:text-gray-300">{category.description || "N/A"}</p>
			</div>
			<div>
				<h3 className="text-sm font-semibold text-gray-700 dark:text-white">Status</h3>
				<StatusBadge isActive={!category.deletedAt} />
			</div>
			<div>
				<h3 className="text-sm font-semibold text-gray-700 dark:text-white">Created At</h3>
				<p className="text-sm text-gray-600 dark:text-gray-300">
					{new Date(category.createdAt).toLocaleString()}
				</p>
			</div>
			<div>
				<h3 className="text-sm font-semibold text-gray-700 dark:text-white">Updated At</h3>
				<p className="text-sm text-gray-600 dark:text-gray-300">
					{new Date(category.updatedAt).toLocaleString()}
				</p>
			</div>
		</div>
	);

	return (
		<>
			<ListPage<Category>
				title="Category Management"
				description="Manage course categories and their settings"
				entityName="Category"
				data={categoriesQuery.data}
				isLoading={categoriesQuery.isLoading}
				error={categoriesQuery.error}
				refetch={categoriesQuery.refetch}
				page={page}
				setPage={setPage}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				filterStatus={filterStatus}
				setFilterStatus={setFilterStatus}
				actionLoading={isDeleting}
				sortBy={sortBy}
				setSortBy={setSortBy}
				sortOrder={sortOrder}
				setSortOrder={setSortOrder}
				filterOptions={[
					{ label: "All", value: "All" },
					{ label: "Active", value: "Active" },
					{ label: "Inactive", value: "Inactive" },
				]}
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
						label: "View",
						onClick: (category) => handleViewCategory(category),
						variant: "outline",
					},
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
			/>

			<CategoryFormModal
				open={isAddOpen}
				onOpenChange={setIsAddOpen}
				onSubmit={handleAddSubmit}
				title="Add New Category"
				submitText="Save"
				isLoading={isCreating}
			/>

			<CategoryFormModal
				open={isEditOpen}
				onOpenChange={(open) => {
					setIsEditOpen(open);
					if (!open) setEditCategory(undefined);
				}}
				onSubmit={handleEditSubmit}
				initialData={editCategory ? { name: editCategory.name, description: editCategory.description } : undefined}
				title="Edit Category"
				submitText="Update"
				isLoading={isUpdating}
			/>

			{viewCategory && (
				<AlertComponent
					open={isViewOpen}
					onOpenChange={(open) => {
						setIsViewOpen(open);
						if (!open) setViewCategory(undefined);
					}}
					title={`View Category: ${viewCategory.name}`}
					description={renderCategoryDetails(viewCategory)}
					confirmText="Close"
					cancelText={null}
					onConfirm={() => setIsViewOpen(false)}
				/>
			)}
		</>
	);
}
