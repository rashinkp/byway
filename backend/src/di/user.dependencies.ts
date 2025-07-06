import { UserController } from "../presentation/http/controllers/user.controller";
import { GetAllUsersUseCase } from "../app/usecases/user/implementations/get-all-users.usecase";
import { GetCurrentUserUseCase } from "../app/usecases/user/implementations/get-current-user.usecase";
import { ToggleDeleteUserUseCase } from "../app/usecases/user/implementations/toggle-deletet-user.usecase";
import { GetUserByIdUseCase } from "../app/usecases/user/implementations/get-user-by-id.usecase";
import { UpdateUserUseCase } from "../app/usecases/user/implementations/update-user.usecase";
import { GetPublicUserUseCase } from "../app/usecases/user/implementations/get-user-public.usecase";
import { GetUserAdminDetailsUseCase } from "../app/usecases/user/implementations/get-user-admin-details.usecase";
import { SharedDependencies } from "./shared.dependencies";
import { CreateNotificationsForUsersUseCase } from "../app/usecases/notification/implementations/create-notifications-for-users.usecase";
import { CheckUserActiveUseCase } from "../app/usecases/user/implementations/check-user-active.usecase";

export interface UserDependencies {
  userController: UserController;
  checkUserActiveUseCase: CheckUserActiveUseCase;
}

export function createUserDependencies(
  deps: SharedDependencies,
  createNotificationsForUsersUseCase: CreateNotificationsForUsersUseCase
): UserDependencies {
  const { userRepository, instructorRepository } = deps;

  // Initialize use cases
  const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
  const toggleDeleteUserUseCase = new ToggleDeleteUserUseCase(userRepository, createNotificationsForUsersUseCase);
  const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository, deps.cartRepository);
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
  const updateUserUseCase = new UpdateUserUseCase(userRepository, deps.s3Service);
  const getPublicUserUseCase = new GetPublicUserUseCase(userRepository);
  const getUserAdminDetailsUseCase = new GetUserAdminDetailsUseCase(userRepository, instructorRepository);
  const checkUserActiveUseCase = new CheckUserActiveUseCase(userRepository);

  // Initialize controller
  const userController = new UserController(
    getAllUsersUseCase,
    toggleDeleteUserUseCase,
    getCurrentUserUseCase,
    getUserByIdUseCase,
    updateUserUseCase,
    getPublicUserUseCase,
    getUserAdminDetailsUseCase,
    deps.httpErrors,
    deps.httpSuccess
  );

  return {
    userController,
    checkUserActiveUseCase,
  };
}
