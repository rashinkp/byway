import { User } from "../../domain/entities/user.entity";
import { UserProfile } from "../../domain/entities/user-profile.entity";
import { PaginatedResult, PaginationFilter } from "../../domain/types/pagination-filter.interface";
import { UserStats } from "../../domain/types/user.interface";


export interface IUserRepository {
  findAll(input: PaginationFilter): Promise<PaginatedResult<User>>;
  findById(id: string): Promise<User | null>;
  updateUser(user: User): Promise<User>;
  updateProfile(profile: UserProfile): Promise<UserProfile>;
  findProfileByUserId(userId: string): Promise<UserProfile | null>;
  createProfile(profile: UserProfile): Promise<UserProfile>;
  getUserStats(input: object): Promise<UserStats>;
  findByRole(role: string): Promise<User[]>;
}
