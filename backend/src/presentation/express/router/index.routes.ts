import { Router } from "express";
import { AppDependencies } from "../../../di/app.dependencies";
import { ILogger } from "../../../app/providers/logger-provider.interface";
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
import { walletRouter } from "./wallet.router";
import { revenueRouter } from "./revenue.router";
import { certificateRouter } from "./certificate.router";

export const createRouter = (deps: AppDependencies, logger: ILogger): Router => {
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
  router.use("/revenue", revenueRouter(deps.revenueController));
  router.use("/certificates", certificateRouter(deps.certificateController));
  router.use("/search", deps.searchRouter);
  router.use("/dashboard", deps.dashboardRouter);
  router.use("/reviews", deps.courseReviewRouter);

  return router;
};
