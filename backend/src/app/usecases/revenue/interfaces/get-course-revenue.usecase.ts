import { GetCourseRevenueParamsDTO, GetCourseRevenueResultDTO } from "../../../dtos/revenue.dto";


export interface IGetCourseRevenueUseCase {
  execute(params: GetCourseRevenueParamsDTO): Promise<GetCourseRevenueResultDTO>;
} 