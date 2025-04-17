import express, { Express, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { configureMiddleware } from "./config/middleware";
import { configureRoutes } from "./routes";
import { initializeAppDependencies } from "./core/dependacies/index";
import { PrismaDatabaseProvider } from "./core/database";
import { errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware";
import dotenv from "dotenv";
const app: Express = express();

dotenv.config();

// Initialize dependencies
const dbProvider = new PrismaDatabaseProvider();
const dependencies = initializeAppDependencies(dbProvider);

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

// Configure routes
configureRoutes(app, dependencies);

// Error-handling middleware
app.use(errorHandlingMiddleware);

export default app;
export { dbProvider };
