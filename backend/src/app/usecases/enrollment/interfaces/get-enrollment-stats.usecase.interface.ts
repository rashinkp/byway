export interface IEnrollmentStats {
  totalEnrollments: number;
}

export interface IGetEnrollmentStatsInput {}

export interface IGetEnrollmentStatsUseCase {
  execute(input: IGetEnrollmentStatsInput): Promise<IEnrollmentStats>;
} 