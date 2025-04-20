'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => string | number | React.ReactNode);
  render?: (item: T) => React.ReactNode;
}

interface Action<T> {
  label: string | ((item: T) => string);
  onClick: (item: T) => void;
  variant?: 'default' | 'outline' | 'destructive' | ((item: T) => 'default' | 'outline' | 'destructive');
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
  const paginatedData = data; // Assume data is already paginated by backend

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Animation variants for rows
  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <div className="space-y-4">
      <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-lg overflow-hidden border border-gray-200/20">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 border-b border-gray-200/20 hover:bg-gray-50/70 transition-colors">
              {columns.map((column, index) => (
                <TableHead
                  key={index}
                  className="text-gray-600 font-semibold text-sm tracking-tight py-4"
                >
                  {column.header}
                </TableHead>
              ))}
              {actions.length > 0 && (
                <TableHead className="text-gray-600 font-semibold text-sm tracking-tight py-4">
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                    className="text-center text-gray-500 py-8"
                  >
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      Loading...
                    </motion.div>
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                    className="text-center text-gray-500 py-8"
                  >
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, index) => (
                  <motion.tr
                    key={index}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={`
                      border-b border-gray-200/20
                      transition-all duration-200
                      hover:bg-white/20 hover:shadow-sm
                      ${onRowClick ? 'cursor-pointer' : ''}
                    `}
                    onClick={() => onRowClick?.(item)}
                  >
                    {columns.map((column, colIndex) => (
                      <TableCell
                        key={colIndex}
                        className="text-gray-800 text-sm py-3"
                      >
                        {column.render
                          ? column.render(item)
                          : typeof column.accessor === 'function'
                          ? column.accessor(item)
                          : (item[column.accessor as keyof T] as React.ReactNode)}
                      </TableCell>
                    ))}
                    {actions.length > 0 && (
                      <TableCell className="py-3">
                        <div className="flex space-x-2">
                          {actions.map((action, actionIndex) => {
                            const label =
                              typeof action.label === 'function'
                                ? action.label(item)
                                : action.label;
                            const variant =
                              typeof action.variant === 'function'
                                ? action.variant(item)
                                : action.variant || 'outline';

                            return (
                              <Button
                                key={actionIndex}
                                variant={variant}
                                size="sm"
                                className={`
                                  relative
                                  text-xs font-medium
                                  rounded-full
                                  transition-all duration-200
                                  hover:scale-105 hover:shadow-md
                                  ${
                                    variant === 'destructive'
                                      ? 'bg-red-500/10 text-red-600 hover:bg-red-500/20'
                                      : variant === 'default'
                                      ? 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/20'
                                      : 'bg-gray-500/10 text-gray-600 hover:bg-gray-500/20'
                                  }
                                `}
                                onClick={(e) => {
                                  e.stopPropagation();
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
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, totalItems ?? data.length)} of{' '}
            {totalItems ?? data.length} items
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="
                bg-white/10 backdrop-blur-md
                border-gray-200/20
                rounded-full
                transition-all duration-200
                hover:bg-white/20 hover:shadow-md
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="
                bg-white/10 backdrop-blur-md
                border-gray-200/20
                rounded-full
                transition-all duration-200
                hover:bg-white/20 hover:shadow-md
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}