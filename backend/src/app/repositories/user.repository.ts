import { UserRecord } from "../records/user.record";
import { UserProfileRecord } from "../records/user-profile.record";

export interface IUserRepository {
  findAll(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    includeDeleted?: boolean;
    search?: string;
    filterBy?: string;
    role?: "USER" | "INSTRUCTOR" | "ADMIN";
  }): Promise<{ items: UserRecord[]; total: number; totalPages: number }>;
  
  findById(id: string): Promise<UserRecord | null>;
  updateUser(userRecord: UserRecord): Promise<UserRecord>;
  updateProfile(profile: UserProfileRecord): Promise<UserProfileRecord>;
  findProfileByUserId(userId: string): Promise<UserProfileRecord | null>;
  createProfile(profile: UserProfileRecord): Promise<UserProfileRecord>;

  // User stats methods
  getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    verifiedUsers: number;
    instructors: number;
    students: number;
  }>;
  
  findByRole(role: "USER" | "INSTRUCTOR" | "ADMIN"): Promise<UserRecord[]>;
}
