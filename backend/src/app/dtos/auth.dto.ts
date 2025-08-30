import { AuthProvider } from "../../domain/enum/auth-provider.enum";
import { Role } from "../../domain/enum/role.enum";

export interface FacebookAuthDto {
  accessToken: string;
  userId: string;
  name: string;
  email?: string;
  picture?: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface GoogleAuthDto {
  accessToken: string;
}

export interface LoginDto {
  email: string;
  password?: string;
  authProvider?: AuthProvider;
}


export interface RegisterDto {
  name: string;
  email: string;
  password?: string;
  role?: Role;
}

// Minimal user info used for auth responses
export interface AuthUserDTO {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface ResendOtpDto {
  email: string;
}


export interface ResetPasswordDto {
  resetToken: string;
  newPassword: string;
}


export interface VerifyOtpDto {
  email: string;
  otp: string;
  type: string;
}

// Minimal user info used for auth responses
export interface AuthUserDTO {
  id: string;
  name: string;
  email: string;
  role: Role;
}
