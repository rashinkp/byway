export interface IEnrollmentStats {
  totalEnrollments: number;
}

export type IGetEnrollmentStatsInput = object;

export interface IGetEnrollmentStatsUseCase {
  execute(input: IGetEnrollmentStatsInput): Promise<IEnrollmentStats>;
} 