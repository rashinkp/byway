import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsConfig } from "../configs/cors.config";
import { cookieConfig } from "../configs/cookie.config";
import { errorMiddleware } from "../middlewares/error.middleware";
import { createAppDependencies } from "../../../di/app.dependencies";
import morgan from "morgan";
import { createRouter } from "../router";
import { expressAdapter } from "../../adapters/express.adapter";

export const createApp = (): Application => {
  const app = express();

  const deps = createAppDependencies();

  // Stripe webhook route - must be before any middleware
  app.post(
    "/api/v1/stripe/webhook",
    express.raw({ type: "application/json" }),
    (req, res) =>
      expressAdapter(
        req,
        res,
        deps.stripeController.handleWebhook.bind(deps.stripeController)
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
