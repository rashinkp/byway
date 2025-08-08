import {
  ICategoryListOutputDTO,
  IGetAllCategoriesInputDTO,
} from "../../../dtos/category.dto";

export interface IGetAllCategoriesUseCase {
  execute(input: IGetAllCategoriesInputDTO): Promise<ICategoryListOutputDTO>;
}
