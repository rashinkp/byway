"use client";

import { useQuery } from "@tanstack/react-query";
import { globalSearch } from "@/api/search";
import { useAuth } from "@/hooks/auth/useAuth";
import { ISearchResult, SearchParams, UseGlobalSearchReturn } from "@/types/search";


export function useGlobalSearch({
	query,
	page = 1,
	limit = 10,
}: SearchParams): UseGlobalSearchReturn {
	const { user } = useAuth();
	const { data, isLoading, error, refetch } = useQuery<ISearchResult>({
		queryKey: ["search", query, page, limit, user?.id],
		queryFn: () => globalSearch({ query, page, limit, userId: user?.id }),
		enabled: !!query,
	});

	const mappedError = error
		? {
				message:
					error instanceof Error
						? error.message
						: "An unexpected error occurred",
			}
		: null;

	return {
		data,
		isLoading,
		error: mappedError,
		refetch,
	};
}
