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
        "p-6 bg-[var(--color-surface)] rounded-lg shadow-sm",
        className
      )}
    >
      <h2 className="text-lg font-semibold text-[var(--color-primary-dark)] mb-4">Filters</h2>

      {/* Sort By */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-[var(--color-primary-dark)] mb-2">Sort By</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="w-full border border-[var(--color-background)] rounded-md p-2 text-sm bg-[var(--color-surface)] text-[var(--color-primary-dark)] flex justify-between items-center hover:border-[var(--color-primary-light)] hover:text-[var(--color-primary-light)] transition-colors"
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
              <span className="ml-2">&#9662;</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-full min-w-[180px] bg-[var(--color-surface)] text-[var(--color-primary-dark)] shadow-lg border-0 p-1"
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
            ].map(option => (
              <DropdownMenuItem
                key={option.value}
                onSelect={() => handleFilterChange("sort", option.value)}
                className={currentFilters.sort === option.value ? "bg-[var(--color-background)] text-[var(--color-primary-dark)] rounded" : "rounded"}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-[var(--color-primary-dark)] mb-2">Category</h3>
        <RadioGroup
          value={currentFilters.category}
          onValueChange={(value) => handleFilterChange("category", value)}
          className="space-y-2"
        >
          <label className="flex items-center gap-2 cursor-pointer group">
            <RadioGroupItem
              value="all"
              className="border-[var(--color-primary-dark)] data-[state=checked]:border-[var(--color-primary-light)] data-[state=checked]:bg-[var(--color-primary-light)]"
            />
            <span className="text-sm text-[var(--color-muted)] group-hover:text-[var(--color-primary-light)] data-[state=checked]:text-[var(--color-primary-light)] transition-colors">All Categories</span>
          </label>
          {categoriesData?.items.map((category) => (
            <label key={category.id} className="flex items-center gap-2 cursor-pointer group">
              <RadioGroupItem
                value={category.id}
                className="border-[var(--color-primary-dark)] data-[state=checked]:border-[var(--color-primary-light)] data-[state=checked]:bg-[var(--color-primary-light)]"
              />
              <span className="text-sm text-[var(--color-muted)] group-hover:text-[var(--color-primary-light)] data-[state=checked]:text-[var(--color-primary-light)] transition-colors">{category.name}</span>
            </label>
          ))}
        </RadioGroup>
        <Link 
          href="/categories" 
          className="text-sm text-[var(--color-primary-light)] hover:text-[var(--color-primary-dark)] block mt-2"
        >
          Show More Categories →
        </Link>
      </div>

      {/* Level Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-[var(--color-primary-dark)] mb-2">Level</h3>
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
            <label key={level.value} className="flex items-center gap-2 cursor-pointer group">
              <RadioGroupItem
                value={level.value}
                className="border-[var(--color-primary-dark)] data-[state=checked]:border-[var(--color-primary-light)] data-[state=checked]:bg-[var(--color-primary-light)]"
              />
              <span className="text-sm text-[var(--color-muted)] group-hover:text-[var(--color-primary-light)] data-[state=checked]:text-[var(--color-primary-light)] transition-colors">{level.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-[var(--color-primary-dark)] mb-2">Price</h3>
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
            <label key={price.value} className="flex items-center gap-2 cursor-pointer group">
              <RadioGroupItem
                value={price.value}
                className="border-[var(--color-primary-dark)] data-[state=checked]:border-[var(--color-primary-light)] data-[state=checked]:bg-[var(--color-primary-light)]"
              />
              <span className="text-sm text-[var(--color-muted)] group-hover:text-[var(--color-primary-light)] data-[state=checked]:text-[var(--color-primary-light)] transition-colors">{price.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Duration Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-[var(--color-primary-dark)] mb-2">Duration</h3>
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
            <label key={duration.value} className="flex items-center gap-2 cursor-pointer group">
              <RadioGroupItem
                value={duration.value}
                className="border-[var(--color-primary-dark)] data-[state=checked]:border-[var(--color-primary-light)] data-[state=checked]:bg-[var(--color-primary-light)]"
              />
              <span className="text-sm text-[var(--color-muted)] group-hover:text-[var(--color-primary-light)] data-[state=checked]:text-[var(--color-primary-light)] transition-colors">{duration.label}</span>
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full border-[var(--color-background)] text-[var(--color-primary-dark)] hover:text-[var(--color-primary-light)] hover:border-[var(--color-primary-light)]"
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
