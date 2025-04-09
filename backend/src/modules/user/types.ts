export interface IUser {
  id: string;
  email: string;
  role: string;
  name?: string;
  password?: string;
  avatar?: string;
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
}

export interface IUserWithProfile {
  user: IUser;
  profile?: IUserProfile; 
}
