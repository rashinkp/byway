import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/appError";
import { JwtUtil } from "../../utils/jwt.util";
import { logger } from "../../utils/logger";
import {
  createInstructorSchema,
  updateInstructorStatusSchema,
} from "./instructor.validators";
import {
  CreateInstructorInput,
  InstructorWithToken,
  IInstructorDetails,
  UpdateInstructorStatusInput,
} from "./instructor.types";
import { UserService } from "../user/user.service";
import { Role, InstructorStatus } from "@prisma/client";
import { IInstructorRepository } from "./instructor.repository.interface";

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

    const user = await this.userService.findUserById(userId);
    if (!user) {
      logger.warn("User not found for instructor creation", { userId });
      throw new AppError("User not found", StatusCodes.NOT_FOUND, "NOT_FOUND");
    }

    // Check if user is already an instructor
    const existingInstructor = await this.instructorRepository.findInstructorByUserId(userId);
    if (existingInstructor) {
      logger.warn("User is already registered as an instructor", { userId });
      throw new AppError(
        "User is already registered as an instructor",
        StatusCodes.BAD_REQUEST,
        "ALREADY_INSTRUCTOR"
      );
    }

    try {
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
        role: user.role, // Keep the original user role
      };

      const newToken = JwtUtil.generateToken(
        {
          id: user.id,
          email: user.email,
          role: user.role,
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

  async approveInstructor(
    input: UpdateInstructorStatusInput
  ): Promise<IInstructorDetails> {
    const parsedInput = updateInstructorStatusSchema.safeParse(input);
    if (!parsedInput.success) {
      logger.warn("Validation failed for approveInstructor", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    const { instructorId } = parsedInput.data;
    const instructor = await this.instructorRepository.findInstructorById(
      instructorId
    );
    if (!instructor) {
      logger.warn("Instructor not found", { instructorId });
      throw new AppError(
        "Instructor not found",
        StatusCodes.NOT_FOUND,
        "NOT_FOUND"
      );
    }

    if (instructor.status === InstructorStatus.APPROVED) {
      logger.warn("Instructor already approved", { instructorId });
      throw new AppError(
        "Instructor already approved",
        StatusCodes.BAD_REQUEST,
        "ALREADY_APPROVED"
      );
    }

    try {
      // Update instructor status to APPROVED
      const updatedInstructor =
        await this.instructorRepository.updateInstructorStatus({
          instructorId,
          status: InstructorStatus.APPROVED,
        });

      // Update user role to INSTRUCTOR
      await this.userService.updateUserRole(instructor.userId, Role.INSTRUCTOR);

      return updatedInstructor;
    } catch (error) {
      logger.error("Error approving instructor", { error, input });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to approve instructor",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }

  async declineInstructor(
    input: UpdateInstructorStatusInput
  ): Promise<IInstructorDetails> {
    const parsedInput = updateInstructorStatusSchema.safeParse(input);
    if (!parsedInput.success) {
      logger.warn("Validation failed for declineInstructor", {
        errors: parsedInput.error.errors,
      });
      throw new AppError(
        `Validation failed: ${parsedInput.error.message}`,
        StatusCodes.BAD_REQUEST,
        "VALIDATION_ERROR"
      );
    }

    const { instructorId } = parsedInput.data;
    const instructor = await this.instructorRepository.findInstructorById(instructorId);
    if (!instructor) {
      logger.warn("Instructor not found", { instructorId });
      throw new AppError(
        "Instructor not found",
        StatusCodes.NOT_FOUND,
        "NOT_FOUND"
      );
    }

    if (instructor.status === InstructorStatus.DECLINED) {
      logger.warn("Instructor already declined", { instructorId });
      throw new AppError(
        "Instructor already declined",
        StatusCodes.BAD_REQUEST,
        "ALREADY_DECLINED"
      );
    }

    return this.instructorRepository.updateInstructorStatus({
      instructorId,
      status: InstructorStatus.DECLINED,
    });
  }

  async getAllInstructors(): Promise<IInstructorDetails[]> {
    try {
      return await this.instructorRepository.findAllInstructors();
    } catch (error) {
      logger.error("Error fetching all instructors", { error });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to fetch instructors",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR"
          );
    }
  }
}