import { Router } from "express";
import { optionalAuth, restrictTo } from "../middlewares/auth.middleware";
import { UserController } from "../../http/controllers/user.controller";
import { expressAdapter } from "../../adapters/express.adapter";

export function userRouter(userController: UserController): Router {
  const router = Router();

  // Admin routes
  router.get("/admin/users", restrictTo("ADMIN"), (req, res) =>
    expressAdapter(req, res, userController.getAllUsers.bind(userController))
  );



  // User routes
  router.get("/me", restrictTo("USER", "INSTRUCTOR", "ADMIN"), (req, res) =>
    expressAdapter(req, res, userController.getCurrentUser.bind(userController))
  );

  router.get(
    "/:userId",
    restrictTo("USER", "INSTRUCTOR", "ADMIN"),
    (req, res) =>
      expressAdapter(req, res, userController.getUserById.bind(userController))
  );

  router.put("/users", restrictTo("USER", "INSTRUCTOR", "ADMIN"), (req, res) =>
    expressAdapter(req, res, userController.updateUser.bind(userController))
  );

  router.get("/:userId/public", optionalAuth, (req, res) =>
    expressAdapter(req, res, userController.getPublicUser.bind(userController))
  );


  router.patch("/softDelete/:id", restrictTo("ADMIN"), (req, res) =>
    expressAdapter(
      req,
      res,
      userController.toggleDeleteUser.bind(userController)
    )
  );

  router.get("/admin/:userId", restrictTo("ADMIN"), (req, res) =>
    expressAdapter(req, res, userController.getUserAdminDetails.bind(userController))
  );

  return router;
}
