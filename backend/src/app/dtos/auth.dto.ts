// ============================================================================
// AUTHENTICATION REQUEST DTOs
// ============================================================================

export interface LoginRequestDto {
  email: string;
  password?: string;
  authProvider?: "EMAIL" | "GOOGLE" | "FACEBOOK";
  googleId?: string;
  facebookId?: string;
}

export interface RegisterRequestDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  authProvider?: "EMAIL" | "GOOGLE" | "FACEBOOK";
}

export interface GoogleAuthRequestDto {
  token: string;
}

export interface FacebookAuthRequestDto {
  accessToken: string;
  userId: string;
  name: string;
  email: string;
  picture?: string; // Optional, can be used for avatar
}

export interface ForgotPasswordRequestDto {
  email: string;
}

export interface ResetPasswordRequestDto {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyOtpRequestDto {
  email: string;
  otp: string;
  type:'signup' | 'password-reset'; // Type of verification
}

export interface ResendOtpRequestDto {
  email: string;
}

export interface RefreshTokenRequestDto {
  refreshToken: string;
}

export interface LogoutRequestDto {
  refreshToken: string;
}

// ============================================================================
// AUTHENTICATION RESPONSE DTOs
// ============================================================================

export interface AuthResponseDto {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    isActive: boolean;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface VerifyOtpResponseDto {
  message: string;
  token?: string;
}

export interface ForgotPasswordResponseDto {
  message: string;
}

export interface ResetPasswordResponseDto {
  message: string;
}

export interface ResendOtpResponseDto {
  message: string;
}

export interface LogoutResponseDto {
  message: string;
}
