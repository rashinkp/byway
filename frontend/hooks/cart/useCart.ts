"use client";

import { getCart } from "@/api/cart";
import { ICart, IGetCartInput } from "@/types/cart";
import { useQuery } from "@tanstack/react-query";

interface UseCartReturn {
	data: { items: ICart[]; total: number; totalPages: number } | undefined;
	isLoading: boolean;
	error: { message: string } | null;
	refetch: () => void;
}

export function useCart(
	{
		page = 1,
		limit = 10,
		includeDeleted = false,
	}: IGetCartInput = {} as IGetCartInput,
): UseCartReturn {
	const { data, isLoading, error, refetch } = useQuery<{
		data: ICart[];
		total: number;
		page: number;
		limit: number;
	}>({
		queryKey: ["cart", page, limit, includeDeleted],
		queryFn: async () => {
			const { cartItems, total } = await getCart({
				page,
				limit,
				includeDeleted,
			});

			return {
				data: cartItems,
				total,
				page,
				limit,
			};
		},
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
		data: data
			? {
					items: data.data,
					total: data.total,
					totalPages: Math.ceil(data.total / limit),
				}
			: undefined,
		isLoading,
		error: mappedError,
		refetch,
	};
}
