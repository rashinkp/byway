import { ISearchResult } from "../../../dtos/search.dto";
import { SearchParams } from "../../../dtos/search.dto";

export interface IGlobalSearchUseCase {
  execute(params: SearchParams): Promise<ISearchResult>;
}
