import {
  ICategoryOutputDTO,
  IUpdateCategoryInputDTO,
} from "../../../dtos/category.dto";

export interface IUpdateCategoryUseCase {
  execute(input: IUpdateCategoryInputDTO): Promise<ICategoryOutputDTO>;
}
