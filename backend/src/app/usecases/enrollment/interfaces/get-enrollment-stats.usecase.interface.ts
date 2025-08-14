import { IEnrollmentStatsDTO, IGetEnrollmentStatsInputDTO } from "../../../dtos/enrollment.dto";

export interface IGetEnrollmentStatsUseCase {
  execute(input: IGetEnrollmentStatsInputDTO): Promise<IEnrollmentStatsDTO>;
} 