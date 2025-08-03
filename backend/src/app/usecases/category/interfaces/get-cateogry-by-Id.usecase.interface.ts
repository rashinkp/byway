import {
  ICategoryIdInputDTO,
  ICategoryOutputDTO,
} from "../../../dtos/category/category.dto";

export interface IGetCategoryByIdUseCase {
  execute(input: ICategoryIdInputDTO): Promise<ICategoryOutputDTO>;
}
