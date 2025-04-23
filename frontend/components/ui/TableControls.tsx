"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, RefreshCcw, Filter, ArrowUp, ArrowDown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SortOption<T extends string> {
  value: T;
  label: string;
}

interface TableControlsProps<T extends string> {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  sortBy: T;
  setSortBy: (sort: T) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  sortOptions: SortOption<T>[];
  onRefresh: () => void;
  filterTabs?: { value: string; label: string }[];
}

export function TableControls<T extends string>({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  sortOptions,
  onRefresh,
  filterTabs = [
    { value: "All", label: "All" },
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ],
}: TableControlsProps<T>) {
  const [inputSearchTerm, setInputSearchTerm] = useState(searchTerm);
  const [debouncedSearchTerm] = useDebounce(inputSearchTerm, 300);

  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearchTerm]);

  // Contextual labels for sort order based on sortBy
  const getOrderLabel = () => {
    if (sortBy === "name" || sortBy === "title") {
      return sortOrder === "asc" ? "A-Z" : "Z-A";
    }
    if (sortBy === "createdAt" || sortBy === "updatedAt") {
      return sortOrder === "desc" ? "Newest" : "Oldest";
    }
    if (sortBy === "courses") {
      return sortOrder === "desc" ? "Most" : "Fewest";
    }
    if (sortBy === "email") {
      return sortOrder === "asc" ? "A-Z" : "Z-A";
    }
    return sortOrder === "asc" ? "Ascending" : "Descending";
  };

  return (
    <div className="space-y-4">
      <Tabs
        value={filterStatus}
        onValueChange={setFilterStatus}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 w-64">
          {filterTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search..."
            className="pl-8"
            value={inputSearchTerm}
            onChange={(e) => setInputSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
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
                Sort: {sortOptions.find((opt) => opt.value === sortBy)?.label || "Select"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as T)}>
                {sortOptions.map((option) => (
                  <DropdownMenuRadioItem key={option.value} value={option.value}>
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex items-center gap-1"
          >
            {sortOrder === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
            {getOrderLabel()}
          </Button>
        </div>
      </div>
    </div>
  );
}
