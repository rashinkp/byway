"use client";

import { Category } from "@/types/category";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, CheckCircle, Ban } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CategoryActionsProps {
  category: Category;
  onEdit: (category: Category) => void;
  onToggleDelete: (category: Category) => void;
}

export default function CategoryActions({
  category,
  onEdit,
  onToggleDelete,
}: CategoryActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => onEdit(category)}
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit category</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 w-8 p-0 ${
                category.deletedAt
                  ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                  : "text-red-600 hover:text-red-700 hover:bg-red-50"
              }`}
              onClick={() => onToggleDelete(category)}
            >
              {category.deletedAt ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Ban className="h-4 w-4" />
              )}
              <span className="sr-only">
                {category.deletedAt ? "Activate" : "Deactivate"}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {category.deletedAt ? "Activate category" : "Deactivate category"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onEdit(category)}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onToggleDelete(category)}
            className={`cursor-pointer ${
              category.deletedAt ? "text-green-600" : "text-red-600"
            }`}
          >
            {category.deletedAt ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Activate
              </>
            ) : (
              <>
                <Ban className="mr-2 h-4 w-4" />
                Deactivate
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <Trash2 className="mr-2 h-4 w-4 text-red-600" />
            <span className="text-red-600">Delete permanently</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
