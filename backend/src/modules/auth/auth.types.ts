

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
  name?: string;
  password?: string;
  avatar?: string;
  isVerified?: boolean;
  authProvider?: string;
  deletedAt?: Date | null;
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
