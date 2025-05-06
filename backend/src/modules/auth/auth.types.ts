

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
  role: "USER" | "INSTRUCTOR" | "ADMIN";
  name?: string;
  password?: string;
  avatar?: string;
  isVerified?: boolean;
  authProvider?: "EMAIL_PASSWORD" | "GOOGLE" | "FACEBOOK";
  deletedAt?: Date | null;
  createdAt: Date ;
  updatedAt: Date;
}





export interface IGoogleAuthGateway {
  getUserInfo(accessToken: string): Promise<{
    email: string;
    name?: string;
    sub: string;
    [key: string]: any;
  }>;
}


export interface FacebookAuthData {
  accessToken: string;
  userId: string;
  name?: string;
  email?: string;
  picture?: string;
}
