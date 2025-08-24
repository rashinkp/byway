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
import { BaseController } from "./base.controller";
import { JwtProvider } from "../../../infra/providers/auth/jwt.provider";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export class AuthController extends BaseController {
  constructor(
    private _facebookAuthUseCase: IFacebookAuthUseCase,
    private _forgotPasswordUseCase: IForgotPasswordUseCase,
    private _googleAuthUseCase: IGoogleAuthUseCase,
    private _loginUseCase: ILoginUseCase,
    private _logoutUseCase: ILogoutUseCase,
    private _registerUseCase: IRegisterUseCase,
    private _resendOtpUseCase: IResendOtpUseCase,
    private _resetPasswordUseCase: IResetPasswordUseCase,
    private _verifyOtpUseCase: IVerifyOtpUseCase,
    private _getVerificationStatusUseCase: IGetVerificationStatusUseCase,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  async facebookAuth(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateFacebookAuth(request.body);
      const user = await this._facebookAuthUseCase.execute(validated);
      const data = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      const response = this.success_200(
        data,
        "Facebook authentication successful"
      );
      return {
        ...response,
        cookie: this._getCookieResponse(user),
      };
    });
  }

  async forgotPassword(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateForgotPassword(request.body);
      await this._forgotPasswordUseCase.execute(validated);
      return this.success_200(null, "Password reset OTP sent");
    });
  }

  async googleAuth(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateGoogleAuth(request.body);
      const user = await this._googleAuthUseCase.execute(validated.accessToken);
      const data = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      const response = this.success_200(
        data,
        "Google authentication successful"
      );
      return {
        ...response,
        cookie: this._getCookieResponse(user),
      };
    });
  }

  private _getCookieResponse(user: UserData): { action: "set"; user: UserData } {
    return { action: "set", user };
  }

  private _getUserFromRefreshToken(request: IHttpRequest): UserData {
    const jwtProvider = new JwtProvider();
    const refreshToken = request.cookies?.refresh_token as string;
    if (!refreshToken) {
      throw new BadRequestError("No refresh token provided");
    }
    const payload = jwtProvider.verifyRefreshToken(refreshToken);
    if (
      !payload ||
      typeof payload !== "object" ||
      !(
        "email" in payload &&
        "id" in payload &&
        "name" in payload &&
        "role" in payload
      )
    ) {
      throw new BadRequestError("Invalid refresh token");
    }
    const { id, name, email, role } = payload as UserData;
    return { id, name, email, role };
  }

  async token(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const user = this._getUserFromRefreshToken(request);
      const data = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      const response = this.success_200(data, "Tokens issued");
      return {
        ...response,
        cookie: this._getCookieResponse(user),
      };
    });
  }

  async login(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateLogin(request.body);
      const { user, cartCount } = await this._loginUseCase.execute(validated);
      const data = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        cartCount,
      };
      const response = this.success_200(data, "Login successful");
      return {
        ...response,
        cookie: this._getCookieResponse(user),
      };
    });
  }

  async logout(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async () => {
      await this._logoutUseCase.execute();
      const response = this.success_200(null, "Logout successful");
      return {
        ...response,
        cookie: { action: "clear" },
      };
    });
  }

  async register(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateRegister(request.body);
      const user = await this._registerUseCase.execute(validated);
      const data = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      return this.success_201(data, "Registration successful");
    });
  }

  async resendOtp(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateResendOtp(request.body);
      await this._resendOtpUseCase.execute(validated);
      return this.success_200(null, "OTP resent successfully");
    });
  }

  async resetPassword(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateResetPassword(request.body);
      await this._resetPasswordUseCase.execute(validated);
      return this.success_200(null, "Password reset successful");
    });
  }

  async verifyOtp(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const validated = validateVerifyOtp(request.body);
      const result = await this._verifyOtpUseCase.execute(validated);
      if (validated.type === "password-reset" && result.resetToken) {
        return this.success_200(
          { resetToken: result.resetToken },
          "OTP verification successful"
        );
      }
      if (result.user) {
        const user = result.user;
        const data = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
        return this.success_200(data, "OTP verification successful");
      }
      return this.success_200(null, "OTP verification successful");
    });
  }

  async getVerificationStatus(
    httpRequest: IHttpRequest
  ): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      const email = request.query?.email as string;
      if (!email) {
        throw new BadRequestError("Email is required");
      }
      const result = await this._getVerificationStatusUseCase.execute(email);
      return this.success_200(
        result,
        "Verification status retrieved successfully"
      );
    });
  }
}
