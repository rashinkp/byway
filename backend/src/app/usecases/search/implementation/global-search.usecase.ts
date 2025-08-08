import { ISearchResult, SearchParams } from "../../../dtos/search.dto";
import { ISearchRepository } from "../../../repositories/search.repository";
import { IGlobalSearchUseCase } from "../interfaces/global-search.usecase.interface";

export class GlobalSearchUseCase implements IGlobalSearchUseCase {
  constructor(private searchRepository: ISearchRepository) {}

  async execute(
    params: SearchParams & { userId?: string }
  ): Promise<ISearchResult> {
    return this.searchRepository.search(params);
  }
}
