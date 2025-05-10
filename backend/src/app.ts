import express, { Express, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { configureMiddleware } from "./config/middleware";
import { configureRoutes } from "./routes";
import { initializeAppDependencies } from "./core/dependacies/index";
import { PrismaDatabaseProvider } from "./core/database";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware";
import { createStripeRouter } from "./modules/stripe/stripe.routes"; // Note: .routes, not .router
import dotenv from "dotenv";
import { logger } from "./utils/logger";

const app: Express = express();

dotenv.config();

// Initialize dependencies
const dbProvider = new PrismaDatabaseProvider();
const dependencies = initializeAppDependencies(dbProvider);

// Mount Stripe router before global middleware to bypass express.json()
app.use("/api/v1/strip", createStripeRouter(dependencies.stripeController));

// Configure middleware
configureMiddleware(app);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    status: "success",
    message: "Server is healthy",
    uptime: process.uptime(),
  });
});

// Configure routes (other modules)
configureRoutes(app, dependencies);

// Error-handling middleware
app.use(errorHandlingMiddleware);

// Log server startup
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
export { dbProvider };
