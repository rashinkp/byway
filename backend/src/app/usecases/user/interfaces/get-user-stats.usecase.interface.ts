export interface IUserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalInstructors: number;
  activeInstructors: number;
  inactiveInstructors: number;
}

export type IGetUserStatsInput = object;

export interface IGetUserStatsUseCase {
  execute(input: IGetUserStatsInput): Promise<IUserStats>;
} 