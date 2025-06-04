import { ISearchResult } from "../../domain/dtos/search/search.dto";
import { SearchParams } from "../../domain/dtos/search/search.dto";

export interface ISearchRepository {
  search(params: SearchParams): Promise<ISearchResult>;
} 