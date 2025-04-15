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

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onToggleDelete: (category: Category) => void;
}

export default function CategoryList({
  categories,
  onEdit,
  onToggleDelete,
}: CategoryListProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created At</TableHead>
            {/* <TableHead>Creator</TableHead> */}
            <TableHead>Courses</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No categories found
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description || "-"}</TableCell>
                <TableCell>
                  {new Date(category.createdAt).toLocaleDateString()}
                </TableCell>
                {/* <TableCell>{category.creator.email}</TableCell> */}
                <TableCell>{category.courseCount || 'unknown'}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      !category.deletedAt
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {category.deletedAt ? 'Not Active' : 'Active'}
                  </span>
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
