import { GetAllUsersDto } from "../../domain/dtos/user/user.dto";
import { User } from "../../domain/entities/user.entity";
import { UserProfile } from "../../domain/entities/user-profile.entity";
import { IUserStats, IGetUserStatsInput } from "../usecases/user/interfaces/get-user-stats.usecase.interface";

export interface IPaginatedResponse<T> {
  items: T[];
  total: number;
  totalPages: number;
}

export interface IUserRepository {
  findAll(dto: GetAllUsersDto): Promise<IPaginatedResponse<User>>;
  findById(id: string): Promise<User | null>;
  updateUser(user: User): Promise<User>;
  updateProfile(profile: UserProfile): Promise<UserProfile>;
  findProfileByUserId(userId: string): Promise<UserProfile | null>;
  createProfile(profile: UserProfile): Promise<UserProfile>;
  
  // User stats methods
  getUserStats(input: IGetUserStatsInput): Promise<IUserStats>;
  findByRole(role: string): Promise<User[]>;
}
