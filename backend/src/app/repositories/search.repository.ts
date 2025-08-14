import { ISearchResult } from "../../domain/types/search.interface";


export interface ISearchRepository {
  search(params: {
    query: string;
    page?: number;
    limit?: number;
    userId?: string;
  }): Promise<ISearchResult>;
}
