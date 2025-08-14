import { ISearchResultDTO } from "../../../dtos/search.dto";
import { SearchParamsDTO } from "../../../dtos/search.dto";

export interface IGlobalSearchUseCase {
  execute(params: SearchParamsDTO): Promise<ISearchResultDTO>;
}
