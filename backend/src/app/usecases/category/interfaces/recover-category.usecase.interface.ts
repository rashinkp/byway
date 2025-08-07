import {
  ICategoryIdInputDTO,
  ICategoryOutputDTO,
} from "../../../dtos/category.dto";

export interface IRecoverCategoryUseCase {
  execute(input: ICategoryIdInputDTO): Promise<ICategoryOutputDTO>;
}
