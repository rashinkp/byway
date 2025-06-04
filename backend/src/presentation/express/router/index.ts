import { Router } from "express";
import { AppDependencies } from "../../../di/app.dependencies";
import authRouter from "./auth.router";
import { userRouter } from "./user.router";
import { instructorRouter } from "./instructor.router";
import categoryRouter from "./category.router";
import courseRouter from "./course.router";
import lessonRouter from "./lesson.router";
import lessonContentRouter from "./content.router";
import { cartRouter } from "./cart.router";
import { stripeRouter } from "./stripe.router";
import { transactionRouter } from "./transaction.router";
import { orderRouter } from "./order.router";
import { fileRouter } from "./file.router";
import { progressRouter } from "./progress.router";
import { walletRouter } from "./wallet.routes";

export const createRouter = (deps: AppDependencies): Router => {
  const router = Router();

  router.use("/auth", authRouter(deps.authController));
  router.use("/user", userRouter(deps.userController));
  router.use("/instructor", instructorRouter(deps.instructorController));
  router.use("/category", categoryRouter(deps.categoryController));
  router.use("/courses", courseRouter(deps.courseController));
  router.use("/lessons", lessonRouter(deps.lessonController));
  router.use("/content", lessonContentRouter(deps.lessonContentController));
  router.use("/cart", cartRouter(deps.cartController));
  router.use("/stripe", stripeRouter(deps.stripeController));
  router.use("/transactions", transactionRouter(deps.transactionController));
  router.use("/orders", orderRouter(deps.orderController));
  router.use("/files", fileRouter(deps.fileController));
  router.use("/progress", progressRouter(deps.progressController));
  router.use("/wallet", walletRouter(deps.walletController));
  router.use("/search", deps.searchRouter);

  return router;
}; 