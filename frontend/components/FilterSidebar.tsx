import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/category/useCategories";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "./ui/skeleton";

interface FilterSidebarProps {
  className?: string;
  onFilterChange?: (filters: Record<string, any>) => void;
	currentFilters: Record<string, any>;
	isLoading?: boolean;
}

export function FilterSidebar({
  className,
  onFilterChange,
	currentFilters,
	isLoading = false,
}: FilterSidebarProps) {
  const { data: categoriesData } = useCategories({
    page: 1,
    limit: 4,
    filterBy: "Active",
  });

  const handleFilterChange = (
    key: string,
    value: string | Record<string, string>
  ) => {
    const updatedFilters =
      key === "reset"
        ? (value as Record<string, any>)
        : { ...currentFilters, [key]: value };
    if (onFilterChange) {
      onFilterChange(updatedFilters);
    }
  };

  return (
    <div
      className={cn(
        "p-6  duration-200",
        className
      )}
    >
      <h2 className="text-lg font-semibold text-black dark:text-white mb-4">
        Filters
      </h2>

      {/* Sort By */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-black dark:text-white mb-2">
          Sort By
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="w-full border border-gray-300 dark:border-gray-700 rounded-md p-2 text-sm text-black dark:text-white flex justify-between items-center dark:hover:border-[#facc15] dark:hover:text-[#facc15] transition-colors duration-200 bg-white dark:bg-black"
              type="button"
            >
              {(() => {
                const sortLabels: Record<string, string> = {
                  "title-asc": "Title (A-Z)",
                  "title-desc": "Title (Z-A)",
                  "price-asc": "Price (Low to High)",
                  "price-desc": "Price (High to Low)",
                  "duration-asc": "Duration (Short to Long)",
                  "duration-desc": "Duration (Long to Short)",
                  "createdAt-desc": "Newest First",
                  "createdAt-asc": "Oldest First",
                };
                return sortLabels[currentFilters.sort] || "Sort";
              })()}
              <span className="ml-2">▾</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-full min-w-[180px] bg-white dark:bg-black text-black dark:text-white shadow-lg border border-gray-200 dark:border-gray-700 p-1 rounded-md"
          >
            {[
              { value: "title-asc", label: "Title (A-Z)" },
              { value: "title-desc", label: "Title (Z-A)" },
              { value: "price-asc", label: "Price (Low to High)" },
              { value: "price-desc", label: "Price (High to Low)" },
              { value: "duration-asc", label: "Duration (Short to Long)" },
              { value: "duration-desc", label: "Duration (Long to Short)" },
              { value: "createdAt-desc", label: "Newest First" },
              { value: "createdAt-asc", label: "Oldest First" },
            ].map((option) => (
              <DropdownMenuItem
                key={option.value}
                onSelect={() => handleFilterChange("sort", option.value)}
                className={cn(
                  "rounded transition-colors duration-200",
                  currentFilters.sort === option.value
                    ? "text-black dark:text-[#facc15] font-semibold"
                    : "hover:bg-gray-100 dark:hover:bg-[#facc15]"
                )}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Category Filter */}
      <div className="mb-5">
        <h3 className="text-sm font-medium text-black dark:text-white mb-2">
          Category
        </h3>
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-4 w-60" />
            ))}
          </div>
        ) : (
          <>
            <RadioGroup
              value={currentFilters.category}
              onValueChange={(value) => handleFilterChange("category", value)}
              className="space-y-2"
            >
              <label className="flex items-center gap-2 cursor-pointer group">
                <RadioGroupItem
                  value="all"
                  className="border-black dark:border-white data-[state=checked]:border-[#facc15] data-[state=checked]:bg-[#facc15] data-[state=checked]:text-black"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300 dark:group-hover:text-[#facc15] data-[state=checked]:text-[#facc15] transition-colors duration-200">
                  All Categories
                </span>
              </label>
              {categoriesData?.items.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <RadioGroupItem
                    value={category.id}
                    className="border-black dark:border-white data-[state=checked]:border-[#facc15] data-[state=checked]:bg-[#facc15] data-[state=checked]:text-black"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300 dark:group-hover:text-[#facc15] data-[state=checked]:text-[#facc15] transition-colors duration-200">
                    {category.name}
                  </span>
                </label>
              ))}
            </RadioGroup>
            <Link
              href="/categories"
              className="text-sm dark:text-[#facc15] hover:text-black dark:hover:text-white block mt-6 transition-colors duration-200"
            >
              Show More Categories →
            </Link>
          </>
        )}
      </div>

      {/* Level Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-black dark:text-white mb-2">
          Level
        </h3>
        <RadioGroup
          value={currentFilters.level}
          onValueChange={(value) => handleFilterChange("level", value)}
          className="space-y-2"
        >
          {[
            { label: "All", value: "all" },
            { label: "Beginner", value: "beginner" },
            { label: "Intermediate", value: "intermediate" },
            { label: "Advanced", value: "advanced" },
          ].map((level) => (
            <label
              key={level.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <RadioGroupItem
                value={level.value}
                className="border-black dark:border-white data-[state=checked]:border-[#facc15] data-[state=checked]:bg-[#facc15] data-[state=checked]:text-black"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300 dark:group-hover:text-[#facc15] data-[state=checked]:text-[#facc15] transition-colors duration-200">
                {level.label}
              </span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-black dark:text-white mb-2">
          Price
        </h3>
        <RadioGroup
          value={currentFilters.price}
          onValueChange={(value) => handleFilterChange("price", value)}
          className="space-y-2"
        >
          {[
            { label: "All", value: "all" },
            { label: "Free", value: "free" },
            { label: "Paid", value: "paid" },
          ].map((price) => (
            <label
              key={price.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <RadioGroupItem
                value={price.value}
                className="border-black dark:border-white data-[state=checked]:border-[#facc15] data-[state=checked]:bg-[#facc15] data-[state=checked]:text-black"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300 dark:group-hover:text-[#facc15] data-[state=checked]:text-[#facc15] transition-colors duration-200">
                {price.label}
              </span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Duration Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-black dark:text-white mb-2">
          Duration
        </h3>
        <RadioGroup
          value={currentFilters.duration}
          onValueChange={(value) => handleFilterChange("duration", value)}
          className="space-y-2"
        >
          {[
            { label: "All", value: "all" },
            { label: "Under 5 hours", value: "under 5 hours" },
            { label: "5-10 hours", value: "5-10 hours" },
            { label: "Over 10 hours", value: "over 10 hours" },
          ].map((duration) => (
            <label
              key={duration.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <RadioGroupItem
                value={duration.value}
                className="border-black dark:border-white data-[state=checked]:border-[#facc15] data-[state=checked]:bg-[#facc15] data-[state=checked]:text-black"
              />
              <span className="text-sm text-gray-600 dark:text-gray-300 dark:group-hover:text-[#facc15] data-[state=checked]:text-[#facc15] transition-colors duration-200">
                {duration.label}
              </span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Clear Filters */}
      <Button
        variant="default"
        className="w-full border border-gray-300 dark:border-gray-700 text-black dark:text-white hover:text-[#facc15] hover:border-[#facc15] hover:bg-white dark:hover:bg-black transition-colors duration-200 bg-white dark:bg-black"
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
