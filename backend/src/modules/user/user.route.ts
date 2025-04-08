import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { adaptUserController } from "../../adapters/expressUserAdapters";

export const createUserRouter = (userController: UserController): Router => {
  const userRouter = Router();
  const adapt = adaptUserController(userController);

  userRouter.put("/update", authMiddleware("USER"), adapt.updateUser);

  return userRouter;
};
