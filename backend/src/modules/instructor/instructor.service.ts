import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/appError";
import { JwtUtil } from "../../utils/jwt.util";
import { logger } from "../../utils/logger";
import { createInstructorSchema } from "./instructor.validators";
import {
  CreateInstructorInput,
  IInstructorRepository,
  InstructorWithToken,
} from "./instructor.types";
import { UserService } from "../user/user.service";
import { Role } from "@prisma/client";

export class InstructorService {
  constructor(
    private instructorRepository: IInstructorRepository,
    private jwtSecret: string,
    private userService: UserService
  ) {
    if (!jwtSecret) {
      logger.error("JWT_SECRET not configured");
      throw new AppError(
        "JWT_SECRET not configured",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "CONFIG_ERROR"
      );
    }
  }

  async createInstructor(
    input: CreateInstructorInput
  ): Promise<InstructorWithToken> {
    const parsedInput = createInstructorSchema.safeParse(input);
    if (!parsedInput.success) {
      logger.warn("Validation failed for createInstructor", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    const { areaOfExpertise, professionalExperience, about, userId, website } =
      parsedInput.data;

    // Check if user exists
    const user = await this.userService.findUserById(userId);
    if (!user) {
      logger.warn("User not found for instructor creation", { userId });
      throw new AppError("User not found", StatusCodes.NOT_FOUND, "NOT_FOUND");
    }

    // Check if user is already an instructor
    if (user.role === "INSTRUCTOR") {
      logger.warn("User is already an instructor", { userId });
      throw new AppError(
        "User is already an instructor",
        StatusCodes.BAD_REQUEST,
        "ALREADY_INSTRUCTOR"
      );
    }

    try {
      // Update user role to INSTRUCTOR
      await this.userService.updateUserRole(userId, Role.INSTRUCTOR);

      // Create instructor details
      const instructorDetails =
        await this.instructorRepository.createInstructor({
          areaOfExpertise,
          professionalExperience,
          about,
          userId,
          website,
        });

      const instructor = {
        ...instructorDetails,
        email: user.email,
        role: Role.INSTRUCTOR,
      };

      const newToken = JwtUtil.generateToken(
        {
          id: user.id,
          email: user.email,
          role: Role.INSTRUCTOR,
        },
        this.jwtSecret
      );

      return { ...instructor, newToken };
    } catch (error) {
      logger.error("Error creating instructor", { error, input });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to create instructor",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }
}
