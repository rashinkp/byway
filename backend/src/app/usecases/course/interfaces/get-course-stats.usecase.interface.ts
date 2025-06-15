export interface ICourseStats {
  totalCourses: number;
  activeCourses: number;
  inactiveCourses: number;
  pendingCourses: number;
}

export interface IGetCourseStatsInput {}

export interface IGetCourseStatsUseCase {
  execute(input: IGetCourseStatsInput): Promise<ICourseStats>;
} 