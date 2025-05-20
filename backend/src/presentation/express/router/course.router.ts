import { Router } from "express";
import { restrictTo, optionalAuth } from "../middlewares/auth.middleware";
import { createCourseSchema, createEnrollmentSchema, deleteCourseSchema, getAllCoursesSchema, getCourseByIdSchema, getEnrolledCoursesSchema, updateCourseApprovalSchema, updateCourseSchema } from "../../validators/course.validators";
import { validateRequest } from "../middlewares/validate-request.middleware";
import { CourseController } from "../../http/controllers/course.controller";


export default function courseRouter(
  courseController: CourseController
): Router {
  const router = Router();

  router.post(
    "/",
    restrictTo("INSTRUCTOR", "ADMIN"),
    validateRequest(createCourseSchema),
    (req, res, next) => courseController.createCourse(req, res, next)
  );
  router.get(
    "/",
    optionalAuth,
    validateRequest(getAllCoursesSchema),
    (req, res, next) => courseController.getAllCourses(req, res, next)
  );
  router.get(
    "/enrolled",
    restrictTo("USER", "INSTRUCTOR", "ADMIN"),
    validateRequest(getEnrolledCoursesSchema),
    (req, res, next) => courseController.getEnrolledCourses(req, res, next)
  );
  router.get(
    "/:id",
    optionalAuth,
    validateRequest(getCourseByIdSchema),
    (req, res, next) => courseController.getCourseById(req, res, next)
  );
  router.put(
    "/:id",
    restrictTo("INSTRUCTOR", "ADMIN"),
    validateRequest(updateCourseSchema),
    (req, res, next) => courseController.updateCourse(req, res, next)
  );
  router.delete(
    "/:id",
    restrictTo("INSTRUCTOR", "ADMIN"),
    validateRequest(deleteCourseSchema),
    (req, res, next) => courseController.deleteCourse(req, res, next)
  );
  router.post(
    "/approve",
    restrictTo("ADMIN"),
    validateRequest(updateCourseApprovalSchema),
    (req, res, next) => courseController.approveCourse(req, res, next)
  );
  router.post(
    "/decline",
    restrictTo("ADMIN"),
    validateRequest(updateCourseApprovalSchema),
    (req, res, next) => courseController.declineCourse(req, res, next)
  );
  router.post(
    "/enroll",
    restrictTo("USER", "INSTRUCTOR", "ADMIN"),
    validateRequest(createEnrollmentSchema),
    (req, res, next) => courseController.enrollCourse(req, res, next)
  );

  return router;
}
