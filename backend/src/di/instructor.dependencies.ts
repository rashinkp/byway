import { InstructorController } from "../presentation/http/controllers/instructor.controller";
import { CreateInstructorUseCase } from "../app/usecases/instructor/implementations/create-instructor.usecase";
import { UpdateInstructorUseCase } from "../app/usecases/instructor/implementations/update-instructor.usecase";
import { ApproveInstructorUseCase } from "../app/usecases/instructor/implementations/approve-instructor.usecase";
import { DeclineInstructorUseCase } from "../app/usecases/instructor/implementations/decline-instructor.usecase";
import { GetInstructorByUserIdUseCase } from "../app/usecases/instructor/implementations/get-instructor-by-Id.usecase";
import { GetAllInstructorsUseCase } from "../app/usecases/instructor/implementations/get-all-instructors.usecase";
import { UpdateUserUseCase } from "../app/usecases/user/implementations/update-user.usecase";
import { SharedDependencies } from "./shared.dependencies";
import { GetInstructorDetailsUseCaseImpl } from "../app/usecases/instructor/implementations/get-instructor-details.usecase";

export interface InstructorDependencies {
  instructorController: InstructorController;
}

export function createInstructorDependencies(
  deps: SharedDependencies
): InstructorDependencies {
  const { instructorRepository, userRepository, createNotificationsForUsersUseCase } = deps;

  const updateUserUseCase = new UpdateUserUseCase(userRepository);
  const createInstructorUseCase = new CreateInstructorUseCase(
    instructorRepository,
    userRepository
  );
  const updateInstructorUseCase = new UpdateInstructorUseCase(
    instructorRepository,
    userRepository
  );
  const approveInstructorUseCase = new ApproveInstructorUseCase(
    instructorRepository,
    userRepository,
    updateUserUseCase,
    createNotificationsForUsersUseCase
  );
  const declineInstructorUseCase = new DeclineInstructorUseCase(
    instructorRepository,
    userRepository,
    createNotificationsForUsersUseCase
  );
  const getInstructorByUserIdUseCase = new GetInstructorByUserIdUseCase(
    instructorRepository
  );
  const getAllInstructorsUseCase = new GetAllInstructorsUseCase(
    instructorRepository,
    userRepository
  );

  const getInstructorDetailsUseCase = new GetInstructorDetailsUseCaseImpl(
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
    userRepository,
    getInstructorDetailsUseCase,
    deps.httpErrors,
    deps.httpSuccess
  );

  return {
    instructorController,
  };
}
