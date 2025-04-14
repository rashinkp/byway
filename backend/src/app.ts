import express, { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createAuthRouter } from "./modules/auth/auth.route";
import { createInstructorRouter } from "./modules/instructor/instructor.route";
import { initializeDependencies } from "./core/dependency";
import { StatusCodes } from "http-status-codes";
import { createUserRouter } from "./modules/user/user.route";
import { createOtpRouter } from "./modules/otp/otp.route";
import { createCategoryRouter } from "./modules/category/category.route";
import { createCourseRouter } from "./modules/course/course.route";
import { createLessonRouter } from "./modules/lesson/lesson.route";


dotenv.config();

const app = express();




app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());


const { authController, instructorController, userController, otpController , categoryController,courseController,lessonController } = initializeDependencies();


// Routes
app.use("/api/v1/auth", createAuthRouter(authController));
app.use("/api/v1/instructor", createInstructorRouter(instructorController));
app.use('/api/v1/user' ,createUserRouter(userController) )
app.use('/api/v1/otp', createOtpRouter(otpController));
app.use('/api/v1/category', createCategoryRouter(categoryController));
app.use("/api/v1/courses", createCourseRouter(courseController));
app.use("/api/v1/lessons", createLessonRouter(lessonController));



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