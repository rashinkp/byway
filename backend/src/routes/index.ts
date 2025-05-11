import { Express } from "express";
import { createAuthRouter } from "../modules/auth/auth.route";
import { createUserRouter } from "../modules/user/user.route";
import { createInstructorRouter } from "../modules/instructor/instructor.route";
import { createOtpRouter } from "../modules/otp/otp.route";
import { createCategoryRouter } from "../modules/category/category.route";
import { createCourseRouter } from "../modules/course/course.route";
import { createLessonRouter } from "../modules/lesson/lesson.route";
import { AppDependencies } from "../core/dependacies/index";
import { createContentRouter } from "../modules/content/content.routes";
import { createCartRouter } from "../modules/cart/cart.routes";
import { createEnrollmentRouter } from "../modules/enrollment/enrollment.routes";
import { createOrderouter } from "../modules/order/order.routes";
import { createPaypalRouter } from "../modules/paypal/paypal.routes";
import { createStripeRouter } from "../modules/stripe/stripe.routes";

export const configureRoutes = (
  app: Express,
  dependencies: AppDependencies
): void => {
  app.use("/api/v1/auth", createAuthRouter(dependencies.authController));
  app.use("/api/v1/user", createUserRouter(dependencies.userController));
  app.use(
    "/api/v1/instructor",
    createInstructorRouter(dependencies.instructorController)
  );
  app.use("/api/v1/otp", createOtpRouter(dependencies.otpController));
  app.use(
    "/api/v1/category",
    createCategoryRouter(dependencies.categoryController)
  );
  app.use("/api/v1/courses", createCourseRouter(dependencies.courseController));
  app.use("/api/v1/lessons", createLessonRouter(dependencies.lessonController));
  app.use(
    "/api/v1/content",
    createContentRouter(dependencies.contentController)
  );
  app.use("/api/v1/cart", createCartRouter(dependencies.cartController));
  app.use(
    "/api/v1/enrollments",
    createEnrollmentRouter(dependencies.enrollmentController)
  );
  app.use("/api/v1/orders", createOrderouter(dependencies.orderController));
    app.use(
      "/api/v1/paypal",
      createPaypalRouter(dependencies.paypalController)
  );
  
};
