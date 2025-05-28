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
import { SortOption } from "@/types/common";

interface TableControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  sortOptions: SortOption<any>[];
  onRefresh: () => void;
  filterTabs?: { value: string; label: string }[];
}

export function TableControls({
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
}: TableControlsProps) {
  const [inputSearchTerm, setInputSearchTerm] = useState(searchTerm);
  const [debouncedSearchTerm] = useDebounce(inputSearchTerm, 300);

  useEffect(() => {
    setSearchTerm(debouncedSearchTerm);
  }, [debouncedSearchTerm, setSearchTerm]);

  const getOrderLabel = () => {
    if (sortBy === "name" || sortBy === "title" || sortBy === "email") {
      return sortOrder === "asc" ? "A-Z" : "Z-A";
    }
    if (sortBy === "createdAt" || sortBy === "updatedAt") {
      return sortOrder === "desc" ? "Newest" : "Oldest";
    }
    if (sortBy === "courses") {
      return sortOrder === "desc" ? "Most" : "Fewest";
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
        <TabsList className={`grid w-64 ${filterTabs.length > 3 ? 'grid-cols-4' : 'grid-cols-3'}`}>
          {filterTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="text-xs">
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
        <div className="flex items-center gap-2">
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
                Sort:{" "}
                {sortOptions.find((opt) => opt.value === sortBy)?.label ||
                  "Select"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                {sortOptions.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                  >
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
