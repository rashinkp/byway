
import { ICategoryOutputDTO, ICreateCategoryInputDTO } from "../../../../domain/dtos/category/category.dto";

export interface ICreateCategoryUseCase {
  execute(input: ICreateCategoryInputDTO): Promise<ICategoryOutputDTO>;
}
