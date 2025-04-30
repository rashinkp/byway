import { PrismaClient } from "@prisma/client";
import { AppError } from "../../utils/appError";
import { StatusCodes } from "http-status-codes";
import { logger } from "../../utils/logger";
import {
  CreateInstructorInput,
  IInstructorDetails,
} from "./instructor.types";
import { IInstructorRepository } from "./instructor.repository.interface";

export class InstructorRepository implements IInstructorRepository {
  constructor(private prisma: PrismaClient) {}

  async createInstructor(
    input: CreateInstructorInput
  ): Promise<IInstructorDetails> {
    const { areaOfExpertise, professionalExperience, about, userId, website } =
      input;

    try {
      const instructorDetails = await this.prisma.instructorDetails.create({
        data: {
          areaOfExpertise,
          professionalExperience,
          about,
          userId,
          website,
        },
      });

      return {
        id: instructorDetails.id,
        areaOfExpertise: instructorDetails.areaOfExpertise,
        professionalExperience: instructorDetails.professionalExperience,
        about: instructorDetails.about ?? null,
        userId: instructorDetails.userId,
        website: instructorDetails.website ?? null,
      };
    } catch (error) {
      logger.error("Error creating instructor details", { error, input });
      throw error instanceof AppError
        ? error
        : new AppError(
            "Failed to create instructor details",
            StatusCodes.INTERNAL_SERVER_ERROR,
            "DATABASE_ERROR"
          );
    }
  }
}
