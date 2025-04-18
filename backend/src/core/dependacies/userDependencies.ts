import { IDatabaseProvider } from "../database";
import { UserController } from "../../modules/user/user.controller";
import { UserService } from "../../modules/user/user.service";
import { UserRepository } from "../../modules/user/user.repository";

export interface UserDependencies {
  userController: UserController;
  userService: UserService;
}

export const initializeUserDependencies = (
  dbProvider: IDatabaseProvider
): UserDependencies => {
  const prisma = dbProvider.getClient();
  const userRepository = new UserRepository(prisma);
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);

  return { userController , userService};
};
