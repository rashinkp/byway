import { IDatabaseProvider } from "../database";
import { InstructorController } from "../../modules/instructor/instructor.controller";
import { InstructorService } from "../../modules/instructor/instructor.service";
import { InstructorRepository } from "../../modules/instructor/instructor.repository";
import { AppError } from "../../utils/appError";
import { StatusCodes } from "http-status-codes";
import { UserService } from "../../modules/user/user.service";

export interface InstructorDependencies {
  instructorController: InstructorController;
}

export const initializeInstructorDependencies = (
  dbProvider: IDatabaseProvider,
  userService:UserService
): InstructorDependencies => {

  if (!process.env.JWT_SECRET) {
      throw new AppError(
        "JWT_SECRET environment variable is not set",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "CONFIG_ERROR"
      );
  }
  

  const prisma = dbProvider.getClient();
  const instructorRepository = new InstructorRepository(prisma);
  const instructorService = new InstructorService(
    instructorRepository,
    process.env.JWT_SECRET,
    userService,
  );
  const instructorController = new InstructorController(instructorService);

  return { instructorController };
};
