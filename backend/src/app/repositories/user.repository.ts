import { GetAllUsersRequestDto } from "../dtos/user.dto";
import { UserRecord } from "../records/user.record";
import { UserProfileRecord } from "../records/user-profile.record";
import {
  IUserStats,
  IGetUserStatsInput,
} from "../usecases/user/interfaces/get-user-stats.usecase.interface";

export interface IPaginatedResponse<T> {
  items: T[];
  total: number;
  totalPages: number;
}

export interface IUserRepository {
  findAll(dto: GetAllUsersRequestDto): Promise<IPaginatedResponse<UserRecord>>;
  findById(id: string): Promise<UserRecord | null>;
  updateUser(userRecord: UserRecord): Promise<UserRecord>;
  updateProfile(profile: UserProfileRecord): Promise<UserProfileRecord>;
  findProfileByUserId(userId: string): Promise<UserProfileRecord | null>;
  createProfile(profile: UserProfileRecord): Promise<UserProfileRecord>;

  // User stats methods
  getUserStats(input: IGetUserStatsInput): Promise<IUserStats>;
  findByRole(role: string): Promise<UserRecord[]>;
}
