import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsConfig } from "../configs/cors.config";
import { cookieConfig } from "../configs/cookie.config";
import { errorMiddleware } from "../middlewares/error.middleware";

export const createApp = (): Application => {
  const app = express();

  // Middlewares
  app.use(cors(corsConfig));
  app.use(cookieParser(cookieConfig.secret));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // // Routers
  // app.use("/api/admin", adminRouter);
  // app.use("/api/tutor", tutorRouter);
  // app.use("/api/learner", learnerRouter);
  // app.use("/api/courses", courseRouter);

  // Error Middleware
  app.use(errorMiddleware);

  return app;
};
