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
				<h3 className="text-sm font-semibold text-gray-700">Name</h3>
				<p className="text-sm text-gray-600">{category.name}</p>
			</div>
			<div>
				<h3 className="text-sm font-semibold text-gray-700">Description</h3>
				<p className="text-sm text-gray-600">{category.description || "N/A"}</p>
			</div>
			<div>
				<h3 className="text-sm font-semibold text-gray-700">Status</h3>
				<StatusBadge isActive={!category.deletedAt} />
			</div>
			<div>
				<h3 className="text-sm font-semibold text-gray-700">Created At</h3>
				<p className="text-sm text-gray-600">
					{new Date(category.createdAt).toLocaleString()}
				</p>
			</div>
			<div>
				<h3 className="text-sm font-semibold text-gray-700">Updated At</h3>
				<p className="text-sm text-gray-600">
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
				useDataHook={params => {
					const validSortBy = ["name", "createdAt"] as const;
					const sortBy = validSortBy.includes(params.sortBy as typeof validSortBy[number])
						? (params.sortBy as typeof validSortBy[number])
						: "name";
					const validFilterBy = ["All", "Active", "Inactive"] as const;
					const filterBy = validFilterBy.includes(params.filterBy as typeof validFilterBy[number])
						? (params.filterBy as typeof validFilterBy[number])
						: "All";
					return useCategories({ ...params, sortBy, filterBy });
				}}
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
