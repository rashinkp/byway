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
import {
	Search,
	Filter,
	ArrowUp,
	ArrowDown,
	Clock,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
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
	sortOptions: SortOption<unknown>[];   
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
	filterTabs = [
		{ value: "All", label: "All" },
		{ value: "Active", label: "Active" },
		{ value: "Inactive", label: "Inactive" },
	],
}: TableControlsProps) {
	const [inputSearchTerm, setInputSearchTerm] = useState(searchTerm);
	const [debouncedSearchTerm] = useDebounce(inputSearchTerm, 600);

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

	// Calculate grid columns based on number of filter tabs
	const getGridCols = (count: number) => {
		if (count <= 3) return "grid-cols-3";
		if (count <= 4) return "grid-cols-4";
		if (count <= 5) return "grid-cols-5";
		if (count <= 6) return "grid-cols-6";
		if (count <= 9) return "grid-cols-9";
		return "grid-cols-12";
	};

	return (
    <div className="space-y-6">
      {/* Header with Icon */}
      <div className="flex items-center gap-3">
        <div className="bg-[#facc15]/10 p-2 rounded-lg dark:bg-[#232323]">
          <Clock className="w-5 h-5 text-[#facc15] dark:text-[#facc15]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-black dark:text-white">
            Data Management
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Filter, search, and organize your data
          </p>
        </div>
      </div>

      <Separator />

      {/* Filter Tabs */}
      <div className="space-y-4">
        <Tabs
          value={filterStatus}
          onValueChange={setFilterStatus}
          className="w-full"
        >
          <TabsList
            className={`grid w-full max-w-4xl ${getGridCols(
              filterTabs.length
            )} bg-white/80 dark:bg-[#232323]`}
          >
            {filterTabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-xs"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Search and Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="relative w-full lg:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search..."
              value={inputSearchTerm}
              className="pl-10 w-full bg-white/80 dark:bg-[#232323] text-black dark:text-white border border-gray-200 dark:border-gray-700"
              onChange={(e) => setInputSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
              
                >
                  <Filter className="h-4 w-4" />
                  Sort:{" "}
                  {sortOptions.find((opt) => opt.value === sortBy)?.label ||
                    "Select"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-white/80 dark:bg-[#232323] text-black dark:text-white border-[#facc15] dark:border-[#facc15]"
              >
                <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={sortBy}
                  onValueChange={setSortBy}
                >
                  {sortOptions.map((option) => (
                    <DropdownMenuRadioItem
                      key={option.value}
                      value={option.value}
                      className=" dark:hover:bg-[#facc15] dark:hover:text-black"
                    >
                      {option.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
             
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
    </div>
  );
}
