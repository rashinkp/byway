import {
  AdminUpdateUserInput,
  IGetAllUsersInput,
  IGetAllUsersResponse,
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
} from "./user.validators";

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
}
