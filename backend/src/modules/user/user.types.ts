import { Role } from "@prisma/client";

export interface IUser {
  id: string;
  email: string;
  role: "USER" | "INSTRUCTOR" | "ADMIN";
  name?: string;
  password?: string;
  avatar?: string;
  isVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
  userProfile?: IUserProfile;
  authProvider?: "EMAIL_PASSWORD" | "GOOGLE" | "FACEBOOK";
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



export interface IGetAllUsersWithSkip extends IGetAllUsersInput {
  skip: number;
}


export interface IPublicUser {
  id: string;
  name?: string;
  avatar?: string;
  email?: string;
  skills?: string;
  gender?: 'MALE' | 'FEMALE' | undefined;
  bio?: string;
  role: "USER" | "INSTRUCTOR" | "ADMIN";
  deletedAt?: Date | null;
}