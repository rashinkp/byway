import { Router } from "express";
import { optionalAuth, restrictTo } from "../middlewares/auth.middleware";
import { UserController } from "../../http/controllers/user.controller";
import { expressAdapter } from "../../adapters/express.adapter";

export function userRouter(userController: UserController): Router {
  const router = Router();

  // Admin routes
  router.get("/admin/users", restrictTo("ADMIN"), (req, res, next) =>
    expressAdapter(req, res, userController.getAllUsers.bind(userController), next)
  );

  // User routes
  router.get("/me", restrictTo("USER", "INSTRUCTOR", "ADMIN"), (req, res, next) =>
    expressAdapter(req, res, userController.getCurrentUser.bind(userController), next)
  );

  router.get(
    "/:userId",
    restrictTo("USER", "INSTRUCTOR", "ADMIN"),
    (req, res, next) =>
      expressAdapter(req, res, userController.getUserById.bind(userController), next)
  );

  router.put("/users", restrictTo("USER", "INSTRUCTOR", "ADMIN"), (req, res, next) =>
    expressAdapter(req, res, userController.updateUser.bind(userController), next)
  );

  router.get("/:userId/public", optionalAuth, (req, res, next) =>
    expressAdapter(req, res, userController.getPublicUser.bind(userController), next)
  );

  router.patch("/softDelete/:id", restrictTo("ADMIN"), (req, res, next) =>
    expressAdapter(
      req,
      res,
      userController.toggleDeleteUser.bind(userController),
      next
    )
  );

  router.get("/admin/:userId", restrictTo("ADMIN"), (req, res, next) =>
    expressAdapter(req, res, userController.getUserAdminDetails.bind(userController), next)
  );

  return router;
}
