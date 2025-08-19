import { User } from "../../domain/entities/user.entity";
import { UserProfile } from "../../domain/entities/user-profile.entity";
import {
  PaginatedResult,
  PaginationFilter,
} from "../../domain/types/pagination-filter.interface";
import { UserStats } from "../../domain/types/user.interface";
import { Role } from "../../domain/enum/role.enum";
import { IGenericRepository } from "./generic-repository.interface";

export interface IUserRepository extends IGenericRepository<User> {
  findAll(input: PaginationFilter): Promise<PaginatedResult<User>>;
  updateUser(user: User): Promise<User>;
  updateProfile(profile: UserProfile): Promise<UserProfile>;
  findProfileByUserId(userId: string): Promise<UserProfile | null>;
  createProfile(profile: UserProfile): Promise<UserProfile>;
  getUserStats(input: object): Promise<UserStats>;
  findByRole(role: Role): Promise<User[]>;
}
