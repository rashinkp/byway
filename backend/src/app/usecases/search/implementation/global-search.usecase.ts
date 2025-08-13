import { ISearchResultDTO, SearchParamsDTO } from "../../../dtos/search.dto";
import { ISearchRepository } from "../../../repositories/search.repository";
import { IGlobalSearchUseCase } from "../interfaces/global-search.usecase.interface";

export class GlobalSearchUseCase implements IGlobalSearchUseCase {
  constructor(private searchRepository: ISearchRepository) {}

  async execute(
    params: SearchParamsDTO & { userId?: string }
  ): Promise<ISearchResultDTO> {
    return this.searchRepository.search(params);
  }
}
