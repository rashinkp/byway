export interface ICourseStats {
  totalCourses: number;
  activeCourses: number;
  inactiveCourses: number;
  pendingCourses: number;
}

export interface IGetCourseStatsInput {
  userId?: string;
  includeDeleted?: boolean;
}

export interface IGetCourseStatsUseCase {
  execute(input: IGetCourseStatsInput): Promise<ICourseStats>;
} 