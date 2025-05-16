import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsConfig } from "../configs/cors.config";
import { cookieConfig } from "../configs/cookie.config";
import { errorMiddleware } from "../middlewares/error.middleware";
import authRouter from "../router/auth.router";
import { createAppDependencies } from "../../../di/index.dependencies";
import { userRouter } from "../router/user.router";

export const createApp = (): Application => {
  const app = express();

  // Middlewares
  app.use(cors(corsConfig));
  app.use(cookieParser(cookieConfig.secret));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const { authController , userController } = createAppDependencies();

  // Routers
  // app.use("/api/admin", adminRouter);
  // app.use("/api/tutor", tutorRouter);
  // app.use("/api/learner", learnerRouter);
  // app.use("/api/courses", courseRouter);
  app.use("/api/v1/auth", authRouter(authController));
  app.use("/api/v1/user", userRouter(userController));
  // app.use("/api/cart", cartRouter);
  // app.use("/api/orders", orderRouter);
  // app.use("/api/payments", paymentRouter);

  // Error Middleware
  app.use(errorMiddleware);

  return app;
};
