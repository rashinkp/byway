import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsConfig } from "../configs/cors.config";
import { cookieConfig } from "../configs/cookie.config";
import { errorMiddleware } from "../middlewares/error.middleware";
import morgan from "morgan";
import { createRouter } from "../router/index.routes";
import { expressAdapter } from "../../adapters/express.adapter";
import { AppDependencies } from "../../../di/app.dependencies";

export const createApp = (deps: AppDependencies): Application => {
  const app = express();

  app.post(
    "/api/v1/stripe/webhook",
    express.raw({ type: "application/json" }),
    (req, res , next) =>
      expressAdapter(
        req,
        res,
        deps.stripeController.handleWebhook.bind(deps.stripeController),
        next
      )
  );

  // Middlewares
  app.use(cors(corsConfig));
  app.use(cookieParser(cookieConfig.secret));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  // API Routes
  app.use("/api/v1", createRouter(deps));

  // Error Middleware
  app.use(errorMiddleware);

  return app;
};
