import { ISearchResult } from "../dtos/search.dto";
import { SearchParams } from "../dtos/search.dto";

export interface ISearchRepository {
  search(params: SearchParams): Promise<ISearchResult>;
}
