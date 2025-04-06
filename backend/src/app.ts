import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./modules/auth/auth.route";
import { StatusCodes } from "http-status-codes";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/auth", authRouter);

// Error-handling middleware
app.use((error: any, req: Request, res: Response, next: NextFunction): void => {
  const status: number =
    typeof error.status === "number" ? error.status : StatusCodes.INTERNAL_SERVER_ERROR;
  const message: string = error.message || "Something went wrong";

  res.status(status).json({
    status: "error",
    message,
  });
});

export default app;