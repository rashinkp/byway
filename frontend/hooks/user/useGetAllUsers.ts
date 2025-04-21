"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/api/users";
import { ApiResponse, IPaginatedResponse } from "@/types/apiResponse";
import { User } from "@/types/user";

export const useGetAllUsers = ({
  page = 1,
  limit = 10,
  sortBy,
  sortOrder,
  includeDeleted,
  search,
  filterBy,
  role,
}: {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  includeDeleted?: boolean;
  search?: string;
  filterBy?: string;
  role?: "USER" | "INSTRUCTOR" | "ADMIN";
} = {}) => {
  return useQuery<ApiResponse<IPaginatedResponse<User>>>({
    queryKey: ["users", page, limit, sortBy, sortOrder, includeDeleted, search, filterBy, role],
    queryFn: () => getAllUsers({ page, limit, sortBy, sortOrder, includeDeleted, search, filterBy, role }),
  });
};