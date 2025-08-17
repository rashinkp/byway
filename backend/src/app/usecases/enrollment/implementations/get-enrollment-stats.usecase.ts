import { IEnrollmentStatsDTO, IGetEnrollmentStatsInputDTO } from "../../../dtos/enrollment.dto";
import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { IGetEnrollmentStatsUseCase } from "../interfaces/get-enrollment-stats.usecase.interface";

export class GetEnrollmentStatsUseCase implements IGetEnrollmentStatsUseCase {
  constructor(private readonly _enrollmentRepository: IEnrollmentRepository) {}

  async execute(input: IGetEnrollmentStatsInputDTO): Promise<IEnrollmentStatsDTO> {
    return this._enrollmentRepository.getEnrollmentStats(input);
  }
} 