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
import { IGetVerificationStatusUseCase } from "../../../app/usecases/auth/interfaces/get-verification-status.usecase.interface";
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
import { BadRequestError } from "../errors/bad-request-error";
import { UnauthorizedError } from "../errors/unautherized-error";
import { BaseController } from "./base.controller";

export class AuthController extends BaseController {
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
    private getVerificationStatusUseCase: IGetVerificationStatusUseCase,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  async facebookAuth(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateFacebookAuth(request.body);
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
    });
  }

  async forgotPassword(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateForgotPassword(request.body);
      await this.forgotPasswordUseCase.execute(validated);
      return this.success_200(null, "Password reset OTP sent");
    });
  }

  async googleAuth(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateGoogleAuth(request.body);
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
    });
  }

  async login(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateLogin(request.body);
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
    });
  }

  async logout(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      await this.logoutUseCase.execute();
      return {
        statusCode: 200,
        body: {
          statusCode: 200,
          success: true,
          message: "Logout successful",
          data: null,
        },
        cookie: { 
          action: "clear",
          name: "jwt",
          options: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            path: "/",
          }
        },
      };
    });
  }

  async register(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateRegister(request.body);
      const user = await this.registerUseCase.execute(validated);
      const response = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
      };
      return this.success_201(response, "Registration successful");
    });
  }

  async resendOtp(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateResendOtp(request.body);
      await this.resendOtpUseCase.execute(validated);
      return this.success_200(null, "OTP resent successfully");
    });
  }

  async resetPassword(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateResetPassword(request.body);
      await this.resetPasswordUseCase.execute(validated);
      return this.success_200(null, "Password reset successful");
    });
  }

  async verifyOtp(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateVerifyOtp(request.body);
      const user = await this.verifyOtpUseCase.execute(validated);
      const response = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      return this.success_200(response, "OTP verification successful");
    })
  }

  async getVerificationStatus(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const email = request.query?.email as string;
      
      if (!email) {
        throw new BadRequestError("Email is required");
      }

      const result = await this.getVerificationStatusUseCase.execute(email);
      return this.success_200(result, "Verification status retrieved successfully");
    });
  }
}
