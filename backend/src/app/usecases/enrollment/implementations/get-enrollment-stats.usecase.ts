import { IEnrollmentRepository } from "../../../repositories/enrollment.repository.interface";
import { IGetEnrollmentStatsUseCase, IEnrollmentStats, IGetEnrollmentStatsInput } from "../interfaces/get-enrollment-stats.usecase.interface";

export class GetEnrollmentStatsUseCase implements IGetEnrollmentStatsUseCase {
  constructor(private readonly enrollmentRepository: IEnrollmentRepository) {}

  async execute(input: IGetEnrollmentStatsInput): Promise<IEnrollmentStats> {
    return this.enrollmentRepository.getEnrollmentStats(input);
  }
} 