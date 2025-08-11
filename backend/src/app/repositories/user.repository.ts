import { User } from "../../domain/entities/user.entity";
import { UserProfile } from "../../domain/entities/user-profile.entity";
import {
  IUserStats,
  IGetUserStatsInput,
} from "../usecases/user/interfaces/get-user-stats.usecase.interface";
import { PaginationFilter } from "../../domain/types/pagination-filter.interface";

export interface IPaginatedResponse<T> {
  users: T[];
  total: number;
  totalPages: number;
}

export interface IUserRepository {
  findAll(input: PaginationFilter): Promise<IPaginatedResponse<User>>;
  findById(id: string): Promise<User | null>;
  updateUser(user: User): Promise<User>;
  updateProfile(profile: UserProfile): Promise<UserProfile>;
  findProfileByUserId(userId: string): Promise<UserProfile | null>;
  createProfile(profile: UserProfile): Promise<UserProfile>;
  getUserStats(input: IGetUserStatsInput): Promise<IUserStats>;
  findByRole(role: string): Promise<User[]>;
}
