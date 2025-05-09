import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface FilterSidebarProps {
  className?: string;
  onFilterChange?: (filters: Record<string, any>) => void;
}

export function FilterSidebar({
  className,
  onFilterChange,
}: FilterSidebarProps) {
  const [filters, setFilters] = useState({
    category: "all",
    level: "all",
    price: "all",
    rating: "all",
    duration: "all",
    sort: "title-asc",
  });

  const handleFilterChange = (
    key: string,
    value: string | Record<string, string>
  ) => {
    const updatedFilters =
      key === "reset" ? value : { ...filters, [key]: value };
    setFilters(updatedFilters as typeof filters);
    if (onFilterChange) {
      onFilterChange(updatedFilters as typeof filters);
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
          value={filters.sort}
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
          {["All", "Development", "Design", "Marketing", "Physics"].map(
            (category) => (
              <label key={category} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="category"
                  value={category.toLowerCase()}
                  checked={filters.category === category.toLowerCase()}
                  onChange={() =>
                    handleFilterChange("category", category.toLowerCase())
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">{category}</span>
              </label>
            )
          )}
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
                checked={filters.level === level.toLowerCase()}
                onChange={() =>
                  handleFilterChange("level", level.toLowerCase())
                }
                className="h-4 w-4 text-blue-600-urban focus:ring-blue-500-urban"
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
                checked={filters.price === price.toLowerCase()}
                onChange={() =>
                  handleFilterChange("price", price.toLowerCase())
                }
                className="h-4 w-4 text-blue-600-urban focus:ring-blue-500-urban"
              />
              <span className="text-sm text-gray-600">{price}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Rating</h3>
        <div className="space-y-2">
          {["All", "4.5 & up", "4.0 & up", "3.5 & up"].map((rating) => (
            <label key={rating} className="flex items-center gap-2">
              <input
                type="radio"
                name="rating"
                value={rating.toLowerCase()}
                checked={filters.rating === rating.toLowerCase()}
                onChange={() =>
                  handleFilterChange("rating", rating.toLowerCase())
                }
                className="h-4 w-4 text-blue-600-urban focus:ring-blue-500-urban"
                disabled // Disable until backend supports rating filter
              />
              <span className="text-sm text-gray-600">{rating}</span>
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
                  checked={filters.duration === duration.toLowerCase()}
                  onChange={() =>
                    handleFilterChange("duration", duration.toLowerCase())
                  }
                  className="h-4 w-4 text-blue-600-urban focus:ring-blue-500-urban"
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
