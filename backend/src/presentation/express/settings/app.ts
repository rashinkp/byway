import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsConfig } from "../configs/cors.config";
import { cookieConfig } from "../configs/cookie.config";
import { createErrorMiddleware } from "../middlewares/error.middleware";
import morgan from "morgan";
import { createRouter } from "../router/index.routes";
import { expressAdapter } from "../../adapters/express.adapter";
import { AppDependencies } from "../../../di/app.dependencies";
import { ILogger } from "../../../app/providers/logger-provider.interface";

export const createApp = (deps: AppDependencies, logger: ILogger): Application => {
  const app = express();

  // Stripe webhook endpoint must be registered BEFORE JSON parsing middleware
  app.post(
    "/api/v1/stripe/webhook",
    express.raw({ type: "application/json" }),

    async (req, res, next) => {
      try {
        logger.info(`Stripe webhook received - Method: ${req.method}, URL: ${req.url}`);
        return await expressAdapter(
          req,
          res,
          deps.stripeController.handleWebhook.bind(deps.stripeController),
          next
        );
      } catch (error) {
        logger.error(`Stripe webhook error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return res.status(500).json({ error: 'Webhook processing failed' });
      }
    }
  );

  // Test endpoint to verify webhook is reachable
  app.get("/api/v1/stripe/webhook/test", (req, res) => {
    logger.info("Webhook test endpoint hit");
    res.status(200).json({ 
      message: "Webhook endpoint is reachable",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  });

  // Middlewares
  app.use(cors(corsConfig));
  app.use(cookieParser(cookieConfig.secret));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  // API Routes
  app.use("/api/v1", createRouter(deps, logger));

  // Error Middleware
  app.use(createErrorMiddleware(logger));

  return app;
};
