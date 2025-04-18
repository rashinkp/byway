

export interface IResetPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
}


export interface IForgotPasswordInput {
  email: string;
}



export interface IAuthUser {
  id: string;
  email: string;
  role: string;
  password?: string;
  authProvider?: string;
  isVerified: boolean;
  deletedAt: Date | null;
}


export interface IAuthRepository {
  createAdmin(
    name: string,
    email: string,
    password: string
  ): Promise<IAuthUser>;
  createUser(name: string, email: string, password: string): Promise<IAuthUser>;
  findUserByEmail(email: string): Promise<IAuthUser | null>;
  findUserById(id: string): Promise<IAuthUser | null>;
  resetPassword(email: string, hashedPassword: string): Promise<void>;
}
