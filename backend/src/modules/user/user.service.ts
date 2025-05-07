import {
  AdminUpdateUserInput,
  IGetAllUsersInput,
  IGetAllUsersResponse,
  IPublicUser,
  IUser,
  IUserWithProfile,
  UpdateUserInput,
  UpdateUserRoleInput,
} from "./user.types";
import { UserRepository } from "./user.repository";
import * as bcrypt from "bcrypt";
import { AppError } from "../../utils/appError";
import { StatusCodes } from "http-status-codes";
import { logger } from "../../utils/logger";
import {
  updateUserSchema,
  getAllUsersSchema,
  adminUpdateUserSchema,
  findUserByIdSchema,
  findUserByEmailSchema,
  updateUserRoleSchema,
} from "./user.validators";
import { Role } from "@prisma/client";
import { ApiResponse, IPaginatedResponse } from "../../types/apiResponse";

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async updateUser(input: UpdateUserInput): Promise<IUserWithProfile> {
    const parsedInput = updateUserSchema.safeParse(input);
    if (!parsedInput.success) {
      logger.warn("Validation failed for updateUser", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    const { userId, user, profile } = parsedInput.data;

    const hashedPassword = user?.password
      ? await bcrypt.hash(user.password, 10)
      : undefined;

    return this.userRepository.updateUser({
      userId,
      user: user
        ? {
            name: user.name,
            password: hashedPassword,
            avatar: user.avatar,
          }
        : undefined,
      profile,
    });
  }

  async getAllUsers(
    input: IGetAllUsersInput
  ): Promise<ApiResponse<IPaginatedResponse<IUser>>> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy,
        sortOrder,
        includeDeleted,
        search,
        filterBy,
        role,
      } = input;

      const skip = (page - 1) * limit;

      const result = await this.userRepository.getAllUsers({
        page,
        limit,
        sortBy,
        sortOrder,
        includeDeleted,
        search,
        filterBy,
        role,
        skip,
      });

      const totalPages = Math.ceil(result.total / limit);
      const paginatedResponse: IPaginatedResponse<IUser> = {
        items: result.users,
        total: result.total,
        page,
        limit,
        totalPages,
      };

      return {
        statusCode: 200,
        success: true,
        message: "Users retrieved successfully",
        data: paginatedResponse,
      };
    } catch (error) {
      console.error("Error in getAllUsers:", error);
      return {
        statusCode: 500,
        success: false,
        message: "Failed to retrieve users",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async updateUserByAdmin(input: AdminUpdateUserInput): Promise<void> {
    const parsedInput = adminUpdateUserSchema.safeParse(input);
    if (!parsedInput.success) {
      logger.warn("Validation failed for updateUserByAdmin", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    return this.userRepository.updateUserByAdmin(parsedInput.data);
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    const parsedInput = findUserByEmailSchema.safeParse({ email });
    if (!parsedInput.success) {
      logger.warn("Invalid email for user lookup", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    try {
      const user = await this.userRepository.findUserByEmail(
        parsedInput.data.email
      );
      if (!user) {
        logger.warn("User not found by email", { email });
        return null;
      }
      return user;
    } catch (error) {
      logger.error("Error finding user by email", { error, email });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to find user by email",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async findUserById(id: string): Promise<IUser | null> {
    const parsedInput = findUserByIdSchema.safeParse({ id });
    if (!parsedInput.success) {
      logger.warn("Invalid user ID for user lookup", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    try {
      const user = await this.userRepository.findUserById(parsedInput.data.id);
      if (!user) {
        logger.warn("User not found by ID", { id });
        throw new AppError(
          "User not found",
          StatusCodes.NOT_FOUND,
          "NOT_FOUND"
        );
      }
      return user;
    } catch (error) {
      logger.error("Error finding user by ID", { error, id });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to find user by ID",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async updateUserRole(userId: string, role: Role): Promise<IUser> {
    const parsedInput = updateUserRoleSchema.safeParse({ userId, role });
    if (!parsedInput.success) {
      logger.warn("Validation failed for updateUserRole", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    try {
      const updatedUser = await this.userRepository.updateUserRole(
        parsedInput.data
      );
      return updatedUser;
    } catch (error) {
      logger.error("Error updating user role", { error, userId, role });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to update user role",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async getUserData(userId: string, requesterRole: Role): Promise<IUser> {
    const parsedInput = findUserByIdSchema.safeParse({ id: userId });
    if (!parsedInput.success) {
      logger.warn("Validation failed for getting user", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    try {
      const user = await this.userRepository.getUserData(
        parsedInput.data.id,
        requesterRole
      );
      if (!user) {
        logger.warn("User not found by ID", { userId });
        throw new AppError(
          "User not found",
          StatusCodes.NOT_FOUND,
          "NOT_FOUND"
        );
      }

      // If requester is not an admin and the user is soft-deleted, deny access
      if (requesterRole !== Role.ADMIN && user.deletedAt !== null) {
        logger.warn("Non-admin user attempted to access soft-deleted account", {
          userId,
          requesterRole,
        });
        throw new AppError(
          "Account has been deleted",
          StatusCodes.FORBIDDEN,
          "ACCESS_DENIED"
        );
      }

      return user;
    } catch (error) {
      logger.error("Error getting user data", { error, userId });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to get user data",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async getPublicUserData(userId: string): Promise<IPublicUser> {
    const parsedInput = findUserByIdSchema.safeParse({ id: userId });
    if (!parsedInput.success) {
      logger.warn("Validation failed for getting public user", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    try {
      const user = await this.userRepository.getPublicUserData(userId);
      if (!user) {
        logger.warn("User not found by ID", { userId });
        throw new AppError(
          "User not found",
          StatusCodes.NOT_FOUND,
          "NOT_FOUND"
        );
      }
      if (user.role !== Role.INSTRUCTOR) {
        logger.warn("User is not an instructor", { userId });
        throw new AppError(
          "User is not an instructor",
          StatusCodes.BAD_REQUEST,
          "INVALID_ROLE"
        );
      }
      if (user.deletedAt) {
        logger.warn("Attempted to access soft-deleted user", { userId });
        throw new AppError(
          "User account has been deleted",
          StatusCodes.NOT_FOUND,
          "NOT_FOUND"
        );
      }
      return user;
    } catch (error) {
      logger.error("Error getting public user data", { error, userId });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to get public user data",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }
}
