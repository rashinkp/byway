import { ICategoryIdInputDTO, ICategoryOutputDTO } from "../../../../domain/dtos/category/category.dto";

export interface IDeleteCategoryUseCase {
  execute(input: ICategoryIdInputDTO): Promise<ICategoryOutputDTO>;
}
