import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/category/useCategories";
import Link from "next/link";

interface FilterSidebarProps {
  className?: string;
  onFilterChange?: (filters: Record<string, any>) => void;
  currentFilters: Record<string, any>;
}

export function FilterSidebar({
  className,
  onFilterChange,
  currentFilters,
}: FilterSidebarProps) {
  const { data: categoriesData } = useCategories({
    page: 1,
    limit: 4,
    filterBy: "Active"
  });

  const handleFilterChange = (
    key: string,
    value: string | Record<string, string>
  ) => {
    const updatedFilters = key === "reset" 
      ? value as Record<string, any>
      : { ...currentFilters, [key]: value };
    if (onFilterChange) {
      onFilterChange(updatedFilters);
    }
  };

  return (
    <div
      className={cn(
        "p-6 bg-white rounded-lg shadow-sm border border-gray-100",
        className
      )}
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>

      {/* Sort By */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Sort By</h3>
        <select
          value={currentFilters.sort}
          onChange={(e) => handleFilterChange("sort", e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="title-asc">Title (A-Z)</option>
          <option value="title-desc">Title (Z-A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
          <option value="duration-asc">Duration (Short to Long)</option>
          <option value="duration-desc">Duration (Long to Short)</option>
          <option value="createdAt-desc">Newest First</option>
          <option value="createdAt-asc">Oldest First</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="category"
              value="all"
              checked={currentFilters.category === "all"}
              onChange={() => handleFilterChange("category", "all")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">All Categories</span>
          </label>
          {categoriesData?.items.map((category) => (
            <label key={category.id} className="flex items-center gap-2">
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={currentFilters.category === category.id}
                onChange={() => handleFilterChange("category", category.id)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">{category.name}</span>
            </label>
          ))}
          <Link 
            href="/categories" 
            className="text-sm text-blue-600 hover:text-blue-700 block mt-2"
          >
            Show More Categories →
          </Link>
        </div>
      </div>

      {/* Level Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Level</h3>
        <div className="space-y-2">
          {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
            <label key={level} className="flex items-center gap-2">
              <input
                type="radio"
                name="level"
                value={level.toLowerCase()}
                checked={currentFilters.level === level.toLowerCase()}
                onChange={() =>
                  handleFilterChange("level", level.toLowerCase())
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">{level}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Price</h3>
        <div className="space-y-2">
          {["All", "Free", "Paid"].map((price) => (
            <label key={price} className="flex items-center gap-2">
              <input
                type="radio"
                name="price"
                value={price.toLowerCase()}
                checked={currentFilters.price === price.toLowerCase()}
                onChange={() =>
                  handleFilterChange("price", price.toLowerCase())
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">{price}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Duration Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Duration</h3>
        <div className="space-y-2">
          {["All", "Under 5 hours", "5-10 hours", "Over 10 hours"].map(
            (duration) => (
              <label key={duration} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="duration"
                  value={duration.toLowerCase()}
                  checked={currentFilters.duration === duration.toLowerCase()}
                  onChange={() =>
                    handleFilterChange("duration", duration.toLowerCase())
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">{duration}</span>
              </label>
            )
          )}
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full border-gray-300 text-gray-700 hover:text-blue-600 hover:border-blue-600"
        onClick={() =>
          handleFilterChange("reset", {
            category: "all",
            level: "all",
            price: "all",
            rating: "all",
            duration: "all",
            sort: "title-asc",
          })
        }
      >
        Clear Filters
      </Button>
    </div>
  );
}
