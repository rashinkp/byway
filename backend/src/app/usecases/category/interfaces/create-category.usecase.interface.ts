import {
  ICategoryOutputDTO,
  ICreateCategoryInputDTO,
} from "../../../dtos/category/category.dto";

export interface ICreateCategoryUseCase {
  execute(input: ICreateCategoryInputDTO): Promise<ICategoryOutputDTO>;
}
