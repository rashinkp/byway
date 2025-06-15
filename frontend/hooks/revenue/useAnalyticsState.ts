import { useState, useEffect, useCallback } from "react";
import { DateRange } from "react-day-picker";
import { startOfMonth, endOfMonth } from "date-fns";
import { useDebounce } from "@/hooks/useDebounce";

export function useAnalyticsState() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 500);

  const [latestRevenueParams, setLatestRevenueParams] = useState({
    page: 1,
    limit: 10,
    search: "",
    sortBy: "latest" as "latest" | "oldest",
  });

  // Update query params when debounced search changes
  useEffect(() => {
    setLatestRevenueParams((prev) => ({
      ...prev,
      search: debouncedSearch,
      page: 1,
    }));
  }, [debouncedSearch]);

  const handleSearchInputChange = useCallback((searchTerm: string) => {
    setSearchInput(searchTerm);
  }, []);

  const handleSort = useCallback((sortBy: "latest" | "oldest") => {
    setLatestRevenueParams((prev) => ({ ...prev, sortBy, page: 1 }));
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setLatestRevenueParams((prev) => ({ ...prev, page: newPage }));
  }, []);

  const handleDateChange = useCallback((date: DateRange | undefined) => {
    if (date) {
      setDateRange(date);
    }
  }, []);

  return {
    dateRange,
    searchInput,
    latestRevenueParams,
    handleSearchInputChange,
    handleSort,
    handlePageChange,
    handleDateChange,
  };
} 