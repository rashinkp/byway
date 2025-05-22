import { IGetAllUsersUseCase } from "../../../app/usecases/user/interfaces/get-all-users.usecase.interface";
import { IToggleDeleteUserUseCase } from "../../../app/usecases/user/interfaces/toggle-delete-user.usecase.interface";
import { IGetCurrentUserUseCase } from "../../../app/usecases/user/interfaces/get-current-user.usecase.interface";
import { IGetUserByIdUseCase } from "../../../app/usecases/user/interfaces/get-user-by-id.usecase.interface";
import { IUpdateUserUseCase } from "../../../app/usecases/user/interfaces/update-user.usecase.interface";
import { IGetPublicUserUseCase } from "../../../app/usecases/user/interfaces/get-user-public.usecase.interface";
import {
  ApiResponse,
  PublicUserResponse,
  UserResponse,
} from "../interfaces/ApiResponse";
import {
  validateGetAllUsers,
  validateGetUser,
  validateToggleDeleteUser,
  validateUpdateUser,
} from "../../validators/user.validator";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { IHttpErrors } from "../interfaces/http-errors.interface";
import { IHttpSuccess } from "../interfaces/http-success.interface";
import { IHttpRequest } from "../interfaces/http-request.interface";
import { IHttpResponse } from "../interfaces/http-response.interface";
import { UnauthorizedError } from "../errors/unautherized-error";
import { BadRequestError } from "../errors/bad-request-error";
import { HttpError } from "../errors/http-error";
import { BaseController } from "./base.controller";

export class UserController extends BaseController {
  constructor(
    private getAllUsersUseCase: IGetAllUsersUseCase,
    private toggleDeleteUserUseCase: IToggleDeleteUserUseCase,
    private getCurrentUserUseCase: IGetCurrentUserUseCase,
    private getUserByIdUseCase: IGetUserByIdUseCase,
    private updateUserUseCase: IUpdateUserUseCase,
    private getPublicUserUseCase: IGetPublicUserUseCase,
    httpErrors: IHttpErrors,
    httpSuccess: IHttpSuccess
  ) {
    super(httpErrors, httpSuccess);
  }

  async getAllUsers(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      const validated = validateGetAllUsers(request.query);
      const result = await this.getAllUsersUseCase.execute(validated);
      const response: ApiResponse<{
        items: UserResponse[];
        total: number;
        totalPages: number;
      }> = {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Users retrieved successfully",
        data: {
          items: result.items.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            deletedAt: user.deletedAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          })),
          total: result.total,
          totalPages: result.totalPages,
        },
      };
      return this.success_200(response, "Users retrieved successfully");
    });
  }

  async toggleDeleteUser(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      if (!request.params.id) {
        throw new BadRequestError("User ID is required");
      }
      const validated = validateToggleDeleteUser({
        id: request.params.id,
        deletedAt: request.body.deletedAt,
      });
      const user = await this.toggleDeleteUserUseCase.execute(
        validated,
        request.user
      );
      const response: ApiResponse<UserResponse> = {
        statusCode: StatusCodes.OK,
        success: true,
        message:
          validated.deletedAt === "true"
            ? "User deleted successfully"
            : "User restored successfully",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          deletedAt: user.deletedAt,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
      return this.success_200(response, validated.deletedAt === "true" ? "User deleted successfully" : "User restored successfully");
    });
  }

  async getCurrentUser(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      const user = await this.getCurrentUserUseCase.execute(
        request.user.id
      );
      const { user: fetchedUser, profile } =
        await this.getUserByIdUseCase.execute({ userId: user.id });
      const response: ApiResponse<UserResponse> = {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User retrieved successfully",
        data: {
          id: fetchedUser.id,
          name: fetchedUser.name,
          email: fetchedUser.email,
          role: fetchedUser.role,
          avatar: fetchedUser.avatar,
          bio: profile?.bio,
          education: profile?.education,
          skills: profile?.skills,
          phoneNumber: profile?.phoneNumber,
          country: profile?.country,
          city: profile?.city,
          address: profile?.address,
          dateOfBirth: profile?.dateOfBirth,
          gender: profile?.gender,
          deletedAt: fetchedUser.deletedAt,
          createdAt: fetchedUser.createdAt,
          updatedAt: fetchedUser.updatedAt,
        },
      };
      return this.success_200(response, "User retrieved successfully");
    });
  }

  async getUserById(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      if (!request.params.userId) {
        throw new BadRequestError("User ID is required");
      }
      const validated = validateGetUser({ userId: request.params.userId });
      const { user, profile } = await this.getUserByIdUseCase.execute(
        validated
      );
      if (!user) {
        throw new HttpError("User not found", StatusCodes.NOT_FOUND);
      }
      const response: ApiResponse<UserResponse> = {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User retrieved successfully",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: profile?.bio,
          education: profile?.education,
          skills: profile?.skills,
          phoneNumber: profile?.phoneNumber,
          country: profile?.country,
          city: profile?.city,
          address: profile?.address,
          dateOfBirth: profile?.dateOfBirth,
          gender: profile?.gender,
          deletedAt: user.deletedAt,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
      return this.success_200(response, "User retrieved successfully");
    });
  }

  async updateUser(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.user?.id) {
        throw new UnauthorizedError("User not authenticated");
      }
      const validated = validateUpdateUser(request.body);
      const { user, profile } = await this.updateUserUseCase.execute(
        validated,
        request.user.id
      );
      const response: ApiResponse<UserResponse> = {
        statusCode: StatusCodes.OK,
        success: true,
        message: "User updated successfully",
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: profile?.bio,
          education: profile?.education,
          skills: profile?.skills,
          phoneNumber: profile?.phoneNumber,
          country: profile?.country,
          city: profile?.city,
          address: profile?.address,
          dateOfBirth: profile?.dateOfBirth,
          gender: profile?.gender,
          deletedAt: user.deletedAt,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
      return this.success_200(response, "User updated successfully");
    });
  }

  async getPublicUser(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return this.handleRequest(httpRequest, async (request) => {
      if (!request.params.userId) {
        throw new BadRequestError("User ID is required");
      }
      const validated = validateGetUser({ userId: request.params.userId });
      const { user, profile } = await this.getPublicUserUseCase.execute(
        validated
      );
      if (!user) {
        throw new HttpError("User not found", StatusCodes.NOT_FOUND);
      }
      const response: ApiResponse<PublicUserResponse> = {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Public user retrieved successfully",
        data: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          bio: profile?.bio,
          education: profile?.education,
          skills: profile?.skills,
          country: profile?.country,
          city: profile?.city,
        },
      };
      return this.success_200(response, "Public user retrieved successfully");
    });
  }
}
