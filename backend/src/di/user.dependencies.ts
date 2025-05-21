import { UserController } from "../presentation/http/controllers/user.controller";
import { GetAllUsersUseCase } from "../app/usecases/user/implementations/get-all-users.usecase";
import { GetCurrentUserUseCase } from "../app/usecases/user/implementations/get-current-user.usecase";
import { ToggleDeleteUserUseCase } from "../app/usecases/user/implementations/toggle-deletet-user.usecase";
import { GetUserByIdUseCase } from "../app/usecases/user/implementations/get-user-by-id.usecase";
import { UpdateUserUseCase } from "../app/usecases/user/implementations/update-user.usecase";
import { GetPublicUserUseCase } from "../app/usecases/user/implementations/get-user-public.usecase";
import { SharedDependencies } from "./shared.dependencies";

export interface UserDependencies {
  userController: UserController;
}

export function createUserDependencies(
  deps: SharedDependencies
): UserDependencies {
  const { userRepository } = deps;

  // Initialize use cases
  const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
  const toggleDeleteUserUseCase = new ToggleDeleteUserUseCase(userRepository);
  const getCurrentUserUseCase = new GetCurrentUserUseCase(userRepository);
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
  const updateUserUseCase = new UpdateUserUseCase(userRepository);
  const getPublicUserUseCase = new GetPublicUserUseCase(userRepository);

  // Initialize controller
  const userController = new UserController(
    getAllUsersUseCase,
    toggleDeleteUserUseCase,
    getCurrentUserUseCase,
    getUserByIdUseCase,
    updateUserUseCase,
    getPublicUserUseCase,
    deps.httpErrors,
    deps.httpSuccess
  );

  return {
    userController,
  };
}
