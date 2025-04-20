// src/components/ui/DataTable.tsx
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => string | number | React.ReactNode);
  render?: (item: T) => React.ReactNode;
}

interface Action<T> {
  label: string | ((item: T) => string);
  onClick: (item: T) => void;
  variant?: "default" | "outline" | "destructive" | ((item: T) => "default" | "outline" | "destructive");
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
  actions?: Action<T>[];
  itemsPerPage?: number;
  totalItems?: number;
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
}

export function DataTable<T>({
  data,
  columns,
  isLoading = false,
  onRowClick,
  actions = [],
  itemsPerPage = 10,
  totalItems,
  currentPage: externalCurrentPage,
  setCurrentPage: externalSetCurrentPage,
}: DataTableProps<T>) {
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const currentPage = externalCurrentPage ?? internalCurrentPage;
  const setCurrentPage = externalSetCurrentPage ?? setInternalCurrentPage;

  const totalPages = Math.ceil((totalItems ?? data.length) / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index}>{column.header}</TableHead>
              ))}
              {actions.length > 0 && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                >
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item, index) => (
                <TableRow
                  key={index}
                  onClick={() => onRowClick?.(item)}
                  className={onRowClick ? "cursor-pointer" : ""}
                >
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      {column.render
                        ? column.render(item)
                        : typeof column.accessor === "function"
                        ? column.accessor(item)
                        : (item[column.accessor as keyof T] as React.ReactNode)}
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell>
                      <div className="flex space-x-2">
                        {actions.map((action, actionIndex) => {
                          const label = typeof action.label === 'function' 
                            ? action.label(item) 
                            : action.label;
                          
                          const variant = typeof action.variant === 'function'
                            ? action.variant(item)
                            : action.variant || "outline";
                          
                          return (
                            <Button
                              key={actionIndex}
                              variant={variant}
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click
                                action.onClick(item);
                              }}
                            >
                              {label}
                            </Button>
                          );
                        })}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, totalItems ?? data.length)} of{" "}
            {totalItems ?? data.length} items
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
