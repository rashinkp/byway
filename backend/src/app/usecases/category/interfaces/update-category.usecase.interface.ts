import {
  ICategoryOutputDTO,
  IUpdateCategoryInputDTO,
} from "../../../dtos/category/category.dto";

export interface IUpdateCategoryUseCase {
  execute(input: IUpdateCategoryInputDTO): Promise<ICategoryOutputDTO>;
}
