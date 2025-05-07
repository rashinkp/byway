import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../../types/response";
import {
  AdminUpdateUserInput,
  IGetAllUsersInput,
  IPublicUser,
  IUserWithProfile,
  UpdateUserInput,
} from "./user.types";
import { UserService } from "./user.service";
import { AppError } from "../../utils/appError";
import { logger } from "../../utils/logger";
import { Role } from "@prisma/client";

export class UserController {
  constructor(private userService: UserService) {}

  async updateUser(
    input: UpdateUserInput
  ): Promise<ApiResponse<IUserWithProfile>> {
    try {
      const updatedData = await this.userService.updateUser(input);
      return {
        status: "success",
        data: updatedData,
        message: "User updated successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      logger.error("User update error:", { error, input });
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new AppError(
          error.message,
          StatusCodes.BAD_REQUEST,
          "UPDATE_FAILED"
        );
      }
      throw AppError.badRequest("User update failed");
    }
  }

  async getAllUsers(input: IGetAllUsersInput): Promise<ApiResponse> {
    try {
      const result = await this.userService.getAllUsers(input);
      return {
        status: "success",
        data: result,
        message: "Users retrieved successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      logger.error("Get all users error:", { error, input });
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new AppError(
          error.message,
          StatusCodes.INTERNAL_SERVER_ERROR,
          "RETRIEVE_FAILED"
        );
      }
      throw AppError.internal("Failed to retrieve users");
    }
  }

  async updateUserByAdmin(input: AdminUpdateUserInput): Promise<ApiResponse> {
    try {
      await this.userService.updateUserByAdmin(input);
      return {
        status: "success",
        data: null,
        message: "User soft-deleted successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      logger.error("Admin update user error:", { error, input });
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new AppError(
          error.message,
          StatusCodes.INTERNAL_SERVER_ERROR,
          "UPDATE_FAILED"
        );
      }
      throw AppError.internal("Failed to update user");
    }
  }

  async getUserData(userId: string, requesterRole: Role): Promise<ApiResponse> {
    try {
      const response = await this.userService.getUserData(
        userId,
        requesterRole
      );
      return {
        status: "success",
        data: response,
        message: "User data retrieved successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      logger.error("Error while getting user data:", { error });
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new AppError(
          error.message,
          StatusCodes.INTERNAL_SERVER_ERROR,
          "GETTING_FAILED"
        );
      }
      throw AppError.internal("Failed to get user");
    }
  }

  async getPublicUserData(userId: string): Promise<ApiResponse<IPublicUser>> {
    try {
      const user = await this.userService.getPublicUserData(userId);
      console.log(user);
      return {
        status: "success",
        data: user,
        message: "Public user data retrieved successfully",
        statusCode: StatusCodes.OK,
      };
    } catch (error) {
      logger.error("Error while getting public user data:", { error });
      if (error instanceof AppError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new AppError(
          error.message,
          StatusCodes.BAD_REQUEST,
          "GETTING_FAILED"
        );
      }
      throw AppError.badRequest("Failed to get public user data");
    }
  }
}
