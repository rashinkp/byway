import { ISearchResult, SearchParams } from "@/types/search";
import { api } from "./api";
import { ApiError } from "@/types/error";

export async function globalSearch(
	params: SearchParams,
): Promise<ISearchResult> {
	try {
		const response = await api.get<{ data: ISearchResult }>("/search", {
			params,
		});
		return response.data.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(
			apiError.response?.data?.message ||
				apiError.response?.data?.error ||
				"Search failed",
		);
	}
}
