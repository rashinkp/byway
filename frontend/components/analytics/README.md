# Analytics Components

This directory contains reusable analytics components that can be used across different parts of the application (admin, instructor, etc.).

## Components

### AnalyticsHeader
A header component with title, subtitle, date picker, and live data badge.

**Props:**
- `title: string` - The main title
- `subtitle: string` - The subtitle text
- `dateRange: DateRange` - The selected date range
- `onDateChange: (date: DateRange | undefined) => void` - Date change handler

### RevenueOverviewCards
Displays revenue metrics in a card layout with total revenue, refunded amount, and selected period.

**Props:**
- `overallData: { data: { totalRevenue: number; refundedAmount: number; netRevenue: number; } } | null` - Revenue data
- `dateRange: DateRange` - The selected date range

### LatestRevenueList
A comprehensive list component for displaying latest revenue transactions with search, sort, pagination, and detailed modal.

**Props:**
- `latestData: { data: { items: any[]; total: number; page: number; limit: number; totalPages: number; } } | null | undefined` - Latest revenue data
- `isLoading: boolean` - Loading state
- `onSearchChange: (search: string) => void` - Search change handler
- `onSortChange: (sortBy: "latest" | "oldest") => void` - Sort change handler
- `onPageChange: (page: number) => void` - Page change handler
- `currentSort: "latest" | "oldest"` - Current sort order
- `currentPage: number` - Current page number
- `searchValue: string` - Current search value

## Hooks

### useAnalyticsState
A custom hook that manages analytics state including date range, search, pagination, and sorting.

**Returns:**
- `dateRange: DateRange` - Current date range
- `searchInput: string` - Current search input
- `latestRevenueParams: object` - Latest revenue query parameters
- `handleSearchInputChange: (search: string) => void` - Search input handler
- `handleSort: (sortBy: "latest" | "oldest") => void` - Sort handler
- `handlePageChange: (page: number) => void` - Page change handler
- `handleDateChange: (date: DateRange | undefined) => void` - Date change handler

## Usage Example

```tsx
import { useAnalyticsState } from "@/hooks/analytics";
import {
  AnalyticsHeader,
  RevenueOverviewCards,
  LatestRevenueList,
} from "@/components/analytics";

export default function MyAnalyticsPage() {
  const {
    dateRange,
    searchInput,
    latestRevenueParams,
    handleSearchInputChange,
    handleSort,
    handlePageChange,
    handleDateChange,
  } = useAnalyticsState();

  // Your data fetching logic here...

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <AnalyticsHeader
          title="My Analytics Dashboard"
          subtitle="Track your performance and insights"
          dateRange={dateRange}
          onDateChange={handleDateChange}
        />

        <RevenueOverviewCards
          overallData={overallData}
          dateRange={dateRange}
        />

        <LatestRevenueList
          latestData={latestData}
          isLoading={isLoading}
          onSearchChange={handleSearchInputChange}
          onSortChange={handleSort}
          onPageChange={handlePageChange}
          currentSort={latestRevenueParams.sortBy}
          currentPage={latestData?.data?.page || 1}
          searchValue={searchInput}
        />
      </div>
    </div>
  );
}
```

## Features

- **Responsive Design**: All components are fully responsive
- **Debounced Search**: Search input is debounced to prevent excessive API calls
- **Optimized Performance**: Components use React.memo and useCallback for performance
- **Consistent Styling**: Uses the same design system as the rest of the application
- **Type Safety**: Full TypeScript support with proper type definitions
- **Accessibility**: Proper ARIA labels and keyboard navigation support 