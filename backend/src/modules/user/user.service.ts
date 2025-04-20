import {
  AdminUpdateUserInput,
  IGetAllUsersInput,
  IGetAllUsersResponse,
  IUser,
  IUserWithProfile,
  UpdateUserInput,
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

  async getAllUsers(input: IGetAllUsersInput): Promise<IGetAllUsersResponse> {
    const parsedInput = getAllUsersSchema.safeParse(input);
    if (!parsedInput.success) {
      logger.warn("Validation failed for getAllUsers", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    const { page = 1, limit = 10, role, includeDeleted } = parsedInput.data;
    const skip = (page - 1) * limit;

    const { users, total } = await this.userRepository.getAllUsers({
      page,
      limit,
      skip,
      role,
      includeDeleted,
    });

    return {
      users,
      total,
      page,
      limit,
    };
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
}
