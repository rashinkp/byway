import jwt from "jsonwebtoken";
import { ApiResponse, UserResponse } from "../interfaces/ApiResponse";
import { IFacebookAuthUseCase } from "../../../app/usecases/auth/interfaces/facebook-auth.usecase.interface";
import { IForgotPasswordUseCase } from "../../../app/usecases/auth/interfaces/forgot-passowrd.usecase.interface";
import { IGoogleAuthUseCase } from "../../../app/usecases/auth/interfaces/google-auth.usecase.interface";
import { ILoginUseCase } from "../../../app/usecases/auth/interfaces/login.usecase.interface";
import { ILogoutUseCase } from "../../../app/usecases/auth/interfaces/logout.usecase.interface";
import { IRegisterUseCase } from "../../../app/usecases/auth/interfaces/register.usecase.interface";
import { IResendOtpUseCase } from "../../../app/usecases/auth/interfaces/resend-otp.usecase.interface";
import { IResetPasswordUseCase } from "../../../app/usecases/auth/interfaces/reset-password.usecase.interface";
import { IVerifyOtpUseCase } from "../../../app/usecases/auth/interfaces/verify-otp.usecase.interface";
import {
  validateFacebookAuth,
  validateForgotPassword,
  validateGoogleAuth,
  validateLogin,
  validateRegister,
  validateResendOtp,
  validateResetPassword,
  validateVerifyOtp,
} from "../../validators/auth.validators";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { CookieService } from "../utils/cookie.service";
import { BadRequestError } from "../errors/bad-request-error";
import { UnauthorizedError } from "../errors/unautherized-error";

export class AuthController {
  constructor(
    private facebookAuthUseCase: IFacebookAuthUseCase,
    private forgotPasswordUseCase: IForgotPasswordUseCase,
    private googleAuthUseCase: IGoogleAuthUseCase,
    private loginUseCase: ILoginUseCase,
    private logoutUseCase: ILogoutUseCase,
    private registerUseCase: IRegisterUseCase,
    private resendOtpUseCase: IResendOtpUseCase,
    private resetPasswordUseCase: IResetPasswordUseCase,
    private verifyOtpUseCase: IVerifyOtpUseCase,
    private httpErrors: IHttpErrors,
    private httpSuccess: IHttpSuccess
  ) {}

  async facebookAuth(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validated = validateFacebookAuth(httpRequest.body);
      const user = await this.facebookAuthUseCase.execute(validated);
      const response: ApiResponse<UserResponse> = {
        statusCode: 200,
        success: true,
        message: "Facebook authentication successful",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
      return {
        statusCode: 200,
        body: response,
        cookie: { action: 'set', user }
      };
    } catch (error) {
      if (error instanceof BadRequestError) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }

  async forgotPassword(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validated = validateForgotPassword(httpRequest.body);
      await this.forgotPasswordUseCase.execute(validated);
      return this.httpSuccess.success_200({
        statusCode: 200,
        success: true,
        message: "Password reset OTP sent",
        data: null,
      });
    } catch (error) {
      if (error instanceof BadRequestError) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }

  async googleAuth(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validated = validateGoogleAuth(httpRequest.body);
      const user = await this.googleAuthUseCase.execute(validated.accessToken);
      const response: ApiResponse<UserResponse> = {
        statusCode: 200,
        success: true,
        message: "Google authentication successful",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
      return {
        statusCode: 200,
        body: response,
        cookie: { action: "set", user },
      };
    } catch (error) {
      if (error instanceof BadRequestError) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }

  async login(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validated = validateLogin(httpRequest.body);
      const user = await this.loginUseCase.execute(validated);
      const response: ApiResponse<UserResponse> = {
        statusCode: 200,
        success: true,
        message: "Login successful",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
      return {
        statusCode: 200,
        body: response,
        cookie: { action: "set", user },
      };
    } catch (error) {
      if (
        error instanceof BadRequestError ||
        error instanceof UnauthorizedError
      ) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }

  async logout(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      await this.logoutUseCase.execute();
      const response: ApiResponse<null> = {
        statusCode: 200,
        success: true,
        message: "Logged out successfully",
        data: null,
      };
      return {
        statusCode: 200,
        body: response,
        cookie: { action: "clear"},
      };
    } catch (error) {
      return this.httpErrors.error_500();
    }
  }

  async register(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validated = validateRegister(httpRequest.body);
      const user = await this.registerUseCase.execute(validated);
      const response: ApiResponse<UserResponse> = {
        statusCode: 201,
        success: true,
        message: "Registration successful",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
      return this.httpSuccess.success_201(response);
    } catch (error) {
      if (error instanceof BadRequestError) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }

  async resendOtp(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validated = validateResendOtp(httpRequest.body);
      await this.resendOtpUseCase.execute(validated);
      return this.httpSuccess.success_200({
        statusCode: 200,
        success: true,
        message: "OTP resent successfully",
        data: null,
      });
    } catch (error) {
      if (error instanceof BadRequestError) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }

  async resetPassword(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validated = validateResetPassword(httpRequest.body);
      await this.resetPasswordUseCase.execute(validated);
      return this.httpSuccess.success_200({
        statusCode: 200,
        success: true,
        message: "Password reset successfully",
        data: null,
      });
    } catch (error) {
      if (error instanceof BadRequestError) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }

  async verifyOtp(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const validated = validateVerifyOtp(httpRequest.body);
      const user = await this.verifyOtpUseCase.execute(validated);
      const response: ApiResponse<UserResponse> = {
        statusCode: 200,
        success: true,
        message: "OTP verified successfully",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      };
      return {
        statusCode: 200,
        body: response,
        cookie: { action: "set", user },
      };
    } catch (error) {
      if (error instanceof BadRequestError) {
        return this.httpErrors.error_400();
      }
      return this.httpErrors.error_500();
    }
  }
}
