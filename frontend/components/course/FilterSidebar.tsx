import React from "react";

interface Category {
	id: string;
	name: string;
}

interface FilterSidebarProps {
	filters: { category: string };
	onFilterChange: (filters: { category: string }) => void;
	categories: Category[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
	filters,
	onFilterChange,
	categories,
}) => {
	const handleCategoryChange = (categoryId: string) => {
		const newFilters = {
			...filters,
			category: categoryId,
		};
		onFilterChange(newFilters);
	};

	return (
		<div className="w-64 bg-white p-4 rounded-lg shadow-sm">
			<h2 className="text-lg font-semibold mb-4">Filters</h2>

			{/* Category Filter */}
			<div className="mb-6">
				<h3 className="font-medium mb-2">Category</h3>
				<div className="space-y-2">
					<button
						onClick={() => handleCategoryChange("all")}
						className={`w-full text-left px-3 py-2 rounded-md ${
							filters.category === "all"
								? "bg-primary text-white"
								: "hover:bg-gray-100"
						}`}
					>
						All Categories
					</button>
					{categories.map((category) => (
						<button
							key={category.id}
							onClick={() => handleCategoryChange(category.id)}
							className={`w-full text-left px-3 py-2 rounded-md ${
								filters.category === category.id
									? "bg-primary text-white"
									: "hover:bg-gray-100"
							}`}
						>
							{category.name}
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default FilterSidebar;
