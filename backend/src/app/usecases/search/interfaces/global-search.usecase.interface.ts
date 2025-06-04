import { ISearchResult } from "../../../../domain/dtos/search/search.dto";
import { SearchParams } from "../../../../domain/dtos/search/search.dto";

export interface IGlobalSearchUseCase {
  execute(params: SearchParams): Promise<ISearchResult>;
} 