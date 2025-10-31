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
import { ApiRoutes } from "../../../common/routes";

export const createRouter = (deps: AppDependencies, logger: ILogger): Router => {
  const router = Router();

  router.use(ApiRoutes.AUTH, authRouter(deps.authController));
  router.use(ApiRoutes.USER, userRouter(deps.userController));
  router.use(ApiRoutes.INSTRUCTOR, instructorRouter(deps.instructorController));
  router.use(ApiRoutes.CATEGORY, categoryRouter(deps.categoryController));
  router.use(ApiRoutes.COURSES, courseRouter(deps.courseController));
  router.use(ApiRoutes.LESSONS, lessonRouter(deps.lessonController));
  router.use(ApiRoutes.CONTENT, lessonContentRouter(deps.lessonContentController));
  router.use(ApiRoutes.CART, cartRouter(deps.cartController));
  router.use(ApiRoutes.STRIPE, stripeRouter(deps.stripeController));
  router.use(ApiRoutes.TRANSACTIONS, transactionRouter(deps.transactionController));
  router.use(ApiRoutes.ORDERS, orderRouter(deps.orderController));
  router.use(ApiRoutes.FILES, fileRouter(deps.fileController));
  router.use(ApiRoutes.PROGRESS, progressRouter(deps.progressController));
  router.use(ApiRoutes.WALLET, walletRouter(deps.walletController));
  router.use(ApiRoutes.REVENUE, revenueRouter(deps.revenueController));
  router.use(ApiRoutes.CERTIFICATES, certificateRouter(deps.certificateController));
  router.use(ApiRoutes.SEARCH, deps.searchRouter);
  router.use(ApiRoutes.DASHBOARD, deps.dashboardRouter);
  router.use(ApiRoutes.REVIEWS, deps.courseReviewRouter);

  return router;
};
