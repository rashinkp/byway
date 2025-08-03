import { ISearchResult, SearchParams } from "@/types/search";
import { api } from "./api";

export async function globalSearch(
	params: SearchParams,
): Promise<ISearchResult> {
	try {
		const response = await api.get<{ data: ISearchResult }>("/search", {
			params,
		});
		return response.data.data;
	} catch (error: any) {
		throw new Error(
			error.response?.data?.message ||
				error.response?.data?.error ||
				"Search failed",
		);
	}
}
