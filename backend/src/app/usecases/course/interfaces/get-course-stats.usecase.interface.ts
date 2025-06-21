export interface ICourseStats {
  totalCourses: number;
  activeCourses: number;
  inactiveCourses: number;
  pendingCourses: number;
  approvedCourses: number;
  declinedCourses: number;
  publishedCourses: number;
  draftCourses: number;
  archivedCourses: number;
}

export interface IGetCourseStatsInput {
  userId?: string;
  includeDeleted?: boolean;
  isAdmin?: boolean;
}

export interface IGetCourseStatsUseCase {
  execute(input: IGetCourseStatsInput): Promise<ICourseStats>;
} 