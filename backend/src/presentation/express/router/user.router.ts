import { Router } from "express";
import { UserController } from "../../http/controllers/user.controller";
import { optionalAuth, restrictTo } from "../middlewares/auth.middleware";

export function userRouter(userController: UserController): Router {
  const router = Router();

  // Admin routes
  router.get(
    "/admin/users",
    restrictTo("ADMIN"),
    userController.getAllUsers.bind(userController)
  );

  router.put(
    "/admin/:id",
    restrictTo("ADMIN"),
    userController.toggleDeleteUser.bind(userController)
  );

  // User routes
  router.get(
    "/users/me",
    restrictTo("USER", "INSTRUCTOR", "ADMIN"),
    userController.getCurrentUser.bind(userController)
  );
  router.get(
    "/users/:userId",
    restrictTo("USER", "INSTRUCTOR", "ADMIN"),
    userController.getUserById.bind(userController)
  );
  router.put(
    "/users",
    restrictTo("USER", "INSTRUCTOR", "ADMIN"),
    userController.updateUser.bind(userController)
  );
  router.get(
    "/users/:userId/public",
    optionalAuth,
    userController.getPublicUser.bind(userController)
  );

  return router;
}
