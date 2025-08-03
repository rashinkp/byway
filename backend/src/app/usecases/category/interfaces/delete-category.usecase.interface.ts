import {
  ICategoryIdInputDTO,
  ICategoryOutputDTO,
} from "../../../dtos/category/category.dto";

export interface IDeleteCategoryUseCase {
  execute(input: ICategoryIdInputDTO): Promise<ICategoryOutputDTO>;
}
