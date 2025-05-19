import { PrismaClient } from "@prisma/client";
import { InstructorController } from "../presentation/http/controllers/instructor.controller";
import { InstructorRepository } from "../app/repositories/instructor.repository.impl";
import { UserRepository } from "../app/repositories/user.repository.impl";
import { CreateInstructorUseCase } from "../app/usecases/instructor/implementations/create-instructor.usecase";
import { UpdateInstructorUseCase } from "../app/usecases/instructor/implementations/update-instructor.usecase";
import { ApproveInstructorUseCase } from "../app/usecases/instructor/implementations/approve-instructor.usecase";
import { DeclineInstructorUseCase } from "../app/usecases/instructor/implementations/decline-instructor.usecase";
import { GetInstructorByUserIdUseCase } from "../app/usecases/instructor/implementations/get-instructor-by-Id.usecase";
import { GetAllInstructorsUseCase } from "../app/usecases/instructor/implementations/get-all-instructors.usecase";
import { UpdateUserUseCase } from "../app/usecases/user/implementations/update-user.usecase";

export interface InstructorDependencies {
  instructorController: InstructorController;
}

export function createInstructorDependencies(): InstructorDependencies {
  const prisma = new PrismaClient();
  const instructorRepository = new InstructorRepository(prisma);
  const userRepository = new UserRepository(prisma);

  const createInstructorUseCase = new CreateInstructorUseCase(
    instructorRepository,
    userRepository
  );
  const updateInstructorUseCase = new UpdateInstructorUseCase(
    instructorRepository,
    userRepository
  );
  const updateUserUseCase = new UpdateUserUseCase(userRepository);
  const approveInstructorUseCase = new ApproveInstructorUseCase(
    instructorRepository,
    userRepository,
    updateUserUseCase
  );
  const declineInstructorUseCase = new DeclineInstructorUseCase(
    instructorRepository
  );
  const getInstructorByUserIdUseCase = new GetInstructorByUserIdUseCase(
    instructorRepository
  );
  const getAllInstructorsUseCase = new GetAllInstructorsUseCase(
    instructorRepository,
    userRepository
  );

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
