import {
  ICategoryIdInputDTO,
  ICategoryOutputDTO,
} from "../../../../domain/dtos/category/category.dto";

export interface IGetCategoryByIdUseCase {
  execute(input: ICategoryIdInputDTO): Promise<ICategoryOutputDTO>;
}
