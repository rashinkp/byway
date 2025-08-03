import { ISearchResult } from "../dtos/search/search.dto";
import { SearchParams } from "../dtos/search/search.dto";

export interface ISearchRepository {
  search(params: SearchParams): Promise<ISearchResult>;
}
