import { ICategoryListOutputDTO, IGetAllCategoriesInputDTO } from "../../../../domain/dtos/category/category.dto";


export interface IGetAllCategoriesUseCase {
  execute(input: IGetAllCategoriesInputDTO): Promise<ICategoryListOutputDTO>;
}
