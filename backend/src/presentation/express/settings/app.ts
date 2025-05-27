import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsConfig } from "../configs/cors.config";
import { cookieConfig } from "../configs/cookie.config";
import { errorMiddleware } from "../middlewares/error.middleware";
import authRouter from "../router/auth.router";
import { createAppDependencies } from "../../../di/app.dependencies";
import { userRouter } from "../router/user.router";
import morgan from "morgan";
import { instructorRouter } from "../router/instructor.router";
import categoryRouter from "../router/category.router";
import courseRouter from "../router/course.router";
import lessonRouter from "../router/lesson.router";
import lessonContentRouter from "../router/content.router";
import { cartRouter } from "../router/cart.router";
import { stripeRouter } from "../router/stripe.router";
import { transactionRouter } from "../router/transaction.router";
import { orderRouter } from "../router/order.router";
import { expressAdapter } from "../../adapters/express.adapter";
import { fileRouter } from "../router/file.router";

export const createApp = (): Application => {
  const app = express();

  const {
    authController,
    userController,
    instructorController,
    categoryController,
    courseController,
    lessonController,
    lessonContentController,
    cartController,
    stripeController,
    transactionController,
    orderController,
    fileController
  } = createAppDependencies();


  // Stripe webhook route - must be before any middleware
  app.post(
    "/api/v1/stripe/webhook",
    express.raw({ type: "application/json" }),
    (req, res) =>
      expressAdapter(
        req,
        res,
        stripeController.handleWebhook.bind(stripeController)
      )
  );

  // Middlewares
  app.use(cors(corsConfig));
  app.use(cookieParser(cookieConfig.secret));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  app.use("/api/v1/auth", authRouter(authController));
  app.use("/api/v1/user", userRouter(userController));
  app.use("/api/v1/instructor", instructorRouter(instructorController));
  app.use("/api/v1/category", categoryRouter(categoryController));
  app.use("/api/v1/courses", courseRouter(courseController));
  app.use("/api/v1/lessons", lessonRouter(lessonController));
  app.use("/api/v1/content", lessonContentRouter(lessonContentController));
  app.use("/api/v1/cart", cartRouter(cartController));
  app.use("/api/v1/stripe", stripeRouter(stripeController));
  app.use("/api/v1/transactions", transactionRouter(transactionController));
  app.use("/api/v1/orders", orderRouter(orderController));
  app.use("/api/v1/files", fileRouter(fileController));

  // Error Middleware
  app.use(errorMiddleware);

  return app;
};
