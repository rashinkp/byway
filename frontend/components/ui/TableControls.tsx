// src/components/ui/TableControls.tsx
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
import { Search, RefreshCcw, Filter } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SortOption {
  value: string;
  label: string;
}

interface TableControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  sortOptions: SortOption[];
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
  sortOptions,
  onRefresh,
  filterTabs = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ],
}: TableControlsProps) {
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
                Sort
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
        </div>
      </div>
    </div>
  );
}
