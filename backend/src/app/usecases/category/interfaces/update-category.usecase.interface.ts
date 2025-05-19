import { ICategoryOutputDTO, IUpdateCategoryInputDTO } from "../../../../domain/dtos/category/category.dto";

export interface IUpdateCategoryUseCase {
  execute(input: IUpdateCategoryInputDTO): Promise<ICategoryOutputDTO>;
}
