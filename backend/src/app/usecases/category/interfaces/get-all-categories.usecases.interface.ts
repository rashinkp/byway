import {
  ICategoryListOutputDTO,
  IGetAllCategoriesInputDTO,
} from "../../../dtos/category/category.dto";

export interface IGetAllCategoriesUseCase {
  execute(input: IGetAllCategoriesInputDTO): Promise<ICategoryListOutputDTO>;
}
