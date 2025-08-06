import { User } from "../../domain/entities/user.entity";
import {
  LoginRequestDto,
  RegisterRequestDto,
  GoogleAuthRequestDto,
  FacebookAuthRequestDto,
  ForgotPasswordRequestDto,
  ResetPasswordRequestDto,
  VerifyOtpRequestDto,
  ResendOtpRequestDto,
  RefreshTokenRequestDto,
  LogoutRequestDto,
  AuthResponseDto,
  VerifyOtpResponseDto,
  ForgotPasswordResponseDto,
  ResetPasswordResponseDto,
  ResendOtpResponseDto,
  LogoutResponseDto,
} from "../dtos/auth.dto";

export class AuthMapper {
  // Domain Entity to Response DTOs
  static toAuthResponseDto(user: User, tokens: {
    accessToken: string;
    refreshToken: string;
  }, cartCount?: number): AuthResponseDto {
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email.address,
        avatar: user.avatar,
        role: user.role,
        isActive: !user.isDeleted(),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      cartCount: cartCount || 0,
    };
  }

  static toVerifyOtpResponseDto(
    message: string,
    user?: User,
    tokens?: {
      accessToken: string;
      refreshToken: string;
    },
    cartCount?: number
  ): VerifyOtpResponseDto {
    const response: VerifyOtpResponseDto = {
      message,
    };

    if (user && tokens) {
      response.user = {
        id: user.id,
        name: user.name,
        email: user.email.address,
        avatar: user.avatar,
        role: user.role,
        isActive: !user.isDeleted(),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      response.accessToken = tokens.accessToken;
      response.refreshToken = tokens.refreshToken;
      response.cartCount = cartCount || 0;
    }

    return response;
  }

  static toForgotPasswordResponseDto(message: string): ForgotPasswordResponseDto {
    return {
      message,
    };
  }

  static toResetPasswordResponseDto(message: string): ResetPasswordResponseDto {
    return {
      message,
    };
  }

  static toResendOtpResponseDto(message: string): ResendOtpResponseDto {
    return {
      message,
    };
  }

  static toLogoutResponseDto(message: string): LogoutResponseDto {
    return {
      message,
    };
  }
}