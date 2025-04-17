import { IDatabaseProvider } from "../database";
import { InstructorController } from "../../modules/instructor/instructor.controller";
import { InstructorService } from "../../modules/instructor/instructor.service";
import { InstructorRepository } from "../../modules/instructor/instructor.repository";

export interface InstructorDependencies {
  instructorController: InstructorController;
}

export const initializeInstructorDependencies = (
  dbProvider: IDatabaseProvider
): InstructorDependencies => {
  const prisma = dbProvider.getClient();
  const instructorRepository = new InstructorRepository(prisma);
  const instructorService = new InstructorService(instructorRepository);
  const instructorController = new InstructorController(instructorService);

  return { instructorController };
};
