"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "@/api/users";
import { ApiResponse, IPaginatedResponse } from "@/types/apiResponse";
import {
	User,
	IGetAllUsersInput,
	SortByField,
	NegativeSortByField,
	UserRoleType,
} from "@/types/user";

export type FilterBy =
	| "All"
	| "Active"
	| "Inactive"
	| "Pending"
	| "Approved"
	| "Declined";

interface GetAllUsersParams {
	page?: number;
	limit?: number;
	search?: string;
	sortBy?: SortByField | NegativeSortByField;
	sortOrder?: "asc" | "desc";
	role?: UserRoleType;
	filterBy?: FilterBy;
	includeDeleted?: boolean;
}

interface UseUsersReturn {
	data: { items: User[]; total: number; totalPages: number } | undefined;
	isLoading: boolean;
	error: { message: string } | null;
	refetch: () => void;
}

export function useGetAllUsers(params: GetAllUsersParams): UseUsersReturn {
	// Handle negative sort orders
	let adjustedSortBy: IGetAllUsersInput["sortBy"] =
		params.sortBy as IGetAllUsersInput["sortBy"];
	let adjustedSortOrder: IGetAllUsersInput["sortOrder"] = params.sortOrder;

	if (params.sortBy?.startsWith("-")) {
		adjustedSortBy = params.sortBy.slice(1) as IGetAllUsersInput["sortBy"];
		adjustedSortOrder = params.sortOrder === "asc" ? "desc" : "asc";
	}

	// Adjust includeDeleted based on filterBy
	const shouldIncludeDeleted =
		params.filterBy === "Inactive"
			? true
			: params.filterBy === "Active"
				? false
				: params.includeDeleted;

	const { data, isLoading, error, refetch } = useQuery<
		ApiResponse<IPaginatedResponse<User>>
	>({
		queryKey: [
			"users",
			params.page,
			params.limit,
			params.sortBy,
			params.sortOrder,
			shouldIncludeDeleted,
			params.search,
			params.filterBy,
			params.role,
		],
		queryFn: () =>
			getAllUsers({
				page: params.page,
				limit: params.limit,
				search: params.search,
				includeDeleted: shouldIncludeDeleted,
				sortOrder: adjustedSortOrder,
				sortBy: adjustedSortBy,
				filterBy: params.filterBy,
				role: params.role,
			}),
	});

	// Map error to ensure it has a message property
	const mappedError = error
		? {
				message:
					error instanceof Error
						? error.message
						: "An unexpected error occurred",
			}
		: null;

	return {
		data: data?.data
			? {
					items: data.data.items,
					total: data.data.total,
					totalPages: data.data.totalPages,
				}
			: undefined,
		isLoading,
		error: mappedError,
		refetch,
	};
}
