"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CategoryActions from "./CateogryActions";
import { Category } from "@/types/category";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onToggleDelete: (category: Category) => void;
  isLoading?: boolean;
}

export default function CategoryList({
  categories,
  onEdit,
  onToggleDelete,
  isLoading = false,
}: CategoryListProps) {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Courses</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-24" />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-medium">Name</TableHead>
            <TableHead className="font-medium">Description</TableHead>
            <TableHead className="font-medium">Created At</TableHead>
            <TableHead className="font-medium">Courses</TableHead>
            <TableHead className="font-medium">Status</TableHead>
            <TableHead className="font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No categories found
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="max-w-md truncate">
                  {category.description || "-"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>
                      {new Date(category.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(category.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={category.courseCount ? "default" : "outline"}
                    className={
                      category.courseCount
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        : ""
                    }
                  >
                    {category.courseCount || "0"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`px-2 py-1 ${
                      !category.deletedAt
                        ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100"
                        : "bg-red-100 text-red-800 border-red-200 hover:bg-red-100"
                    }`}
                  >
                    {category.deletedAt ? "Inactive" : "Active"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <CategoryActions
                    category={category}
                    onEdit={onEdit}
                    onToggleDelete={onToggleDelete}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
