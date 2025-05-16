import { AuthController } from "../presentation/http/controllers/auth.controller";
import { UserController } from "../presentation/http/controllers/user.controller";
import { createAuthDependencies } from "./auth.dependencies";
import { createUserDependencies } from "./user.dependencies";


export interface AppDependencies {
  authController: AuthController;
  userController: UserController;
}

export function createAppDependencies(): AppDependencies {
  const { authController } = createAuthDependencies();
  const { userController } = createUserDependencies();

  return {
    authController,
    userController,
  };
}
