import {
  ICategoryIdInputDTO,
  ICategoryOutputDTO,
} from "../../../dtos/category/category.dto";

export interface IRecoverCategoryUseCase {
  execute(input: ICategoryIdInputDTO): Promise<ICategoryOutputDTO>;
}
