import { ICategoryIdInputDTO, ICategoryOutputDTO } from "../../../../domain/dtos/category/category.dto";


export interface IRecoverCategoryUseCase {
  execute(input: ICategoryIdInputDTO): Promise<ICategoryOutputDTO>;

}
