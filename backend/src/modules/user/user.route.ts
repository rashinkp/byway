import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { adaptUserController } from "../../adapters/expressUserAdapters";

export const createUserRouter = (userController: UserController): Router => {
  const userRouter = Router();
  const adapt = adaptUserController(userController);

  userRouter.put("/users", authMiddleware("USER"), adapt.updateUser);
  userRouter.get('/admin/users', authMiddleware('ADMIN'), adapt.getAllUsers);
  userRouter.put('/admin/:userId', authMiddleware('ADMIN'), adapt.updateUserByAdmin)
  
  return userRouter;
};
