import { PrismaClient } from "@prisma/client";
import { InstructorController } from "../presentation/http/controllers/instructor.controller";
import { InstructorRepository } from "../app/repositories/instructor.repository.impl";
import { UserRepository } from "../app/repositories/user.repository.impl";
import { ApproveInstructorUseCase, CreateInstructorUseCase, DeclineInstructorUseCase, GetAllInstructorsUseCase, GetInstructorByUserIdUseCase, UpdateInstructorUseCase } from "../app/usecases/instructor/instructor.usecase";

export interface InstructorDependencies {
  instructorController: InstructorController;
}

export function createInstructorDependencies(): InstructorDependencies {
  const prisma = new PrismaClient();
  const instructorRepository = new InstructorRepository(prisma);
  const userRepository = new UserRepository(prisma);

  const createInstructorUseCase = new CreateInstructorUseCase(instructorRepository, userRepository);
  const updateInstructorUseCase = new UpdateInstructorUseCase(instructorRepository, userRepository);
  const approveInstructorUseCase = new ApproveInstructorUseCase(instructorRepository);
  const declineInstructorUseCase = new DeclineInstructorUseCase(instructorRepository);
  const getInstructorByUserIdUseCase = new GetInstructorByUserIdUseCase(instructorRepository);
  const getAllInstructorsUseCase = new GetAllInstructorsUseCase(instructorRepository, userRepository);

  const instructorController = new InstructorController(
    createInstructorUseCase,
    updateInstructorUseCase,
    approveInstructorUseCase,
    declineInstructorUseCase,
    getInstructorByUserIdUseCase,
    getAllInstructorsUseCase,
    userRepository
  );

  return {
    instructorController,
  };
}
