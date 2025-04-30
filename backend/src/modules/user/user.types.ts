import { Role } from "@prisma/client";

export interface IUser {
  id: string;
  email: string;
  role: string;
  name?: string;
  password?: string;
  avatar?: string;
  isVerified?: boolean;
  authProvider?: string;
  deletedAt?: Date | null;
}

export interface IUserProfile {
  id: string;
  userId: string;
  bio?: string;
  education?: string;
  skills?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  address?: string;
  socialLinks?: string;
  dateOfBirth?: Date;
  gender?: "MALE" | "FEMALE" | "OTHER";
}

export interface UpdateUserInput {
  userId: string;
  user?: Partial<Pick<IUser, "name" | "password" | "avatar">>;
  profile?: Partial<Omit<IUserProfile, "id" | "userId">>;
  googleId?: string;
  facebookId?: string;
  avatar?: string;
}

export interface UpdateUserRoleInput {
  userId: string;
  role: Role;
}

export interface IUserWithProfile {
  user: IUser;
  profile?: IUserProfile;
}

export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface IGetAllUsersInput {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  includeDeleted?: boolean;
  search?: string;
  filterBy?: string;
  role?: "USER" | "INSTRUCTOR" | "ADMIN";
}

export interface IGetAllUsersResponse {
  users: IUser[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminUpdateUserInput {
  userId: string;
  deletedAt?: Date | null;
}

export interface IUserRepository {
  updateUser(input: UpdateUserInput): Promise<IUserWithProfile>;
  getAllUsers(
    input: IGetAllUsersWithSkip
  ): Promise<{ users: IUser[]; total: number }>;
  updateUserByAdmin(input: AdminUpdateUserInput): Promise<void>;
  findUserByEmail(email: string): Promise<IUser | null>;
  findUserById(userId: string): Promise<IUser | null>;
  updateUserRole(input: UpdateUserRoleInput): Promise<IUser>;
}

export interface IGetAllUsersWithSkip extends IGetAllUsersInput {
  skip: number;
}
