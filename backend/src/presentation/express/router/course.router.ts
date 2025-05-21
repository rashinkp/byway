import { Router } from "express";
import { restrictTo, optionalAuth } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";
import {
  createCourseSchema,
  createEnrollmentSchema,
  deleteCourseSchema,
  getAllCoursesSchema,
  getCourseByIdSchema,
  getEnrolledCoursesSchema,
  updateCourseApprovalSchema,
  updateCourseSchema,
} from "../../validators/course.validators";
import { CourseController } from "../../http/controllers/course.controller";
import { expressAdapter } from "../../adapters/express.adapter";

export default function courseRouter(
  courseController: CourseController
): Router {
  const router = Router();

  router.post(
    "/",
    restrictTo("INSTRUCTOR", "ADMIN"),
    validateRequest(createCourseSchema),
    (req, res) =>
      expressAdapter(
        req,
        res,
        courseController.createCourse.bind(courseController)
      )
  );
  router.get(
    "/",
    optionalAuth,
    validateRequest(getAllCoursesSchema),
    (req, res) =>
      expressAdapter(
        req,
        res,
        courseController.getAllCourses.bind(courseController)
      )
  );
  router.get(
    "/enrolled",
    restrictTo("USER", "INSTRUCTOR", "ADMIN"),
    validateRequest(getEnrolledCoursesSchema),
    (req, res) =>
      expressAdapter(
        req,
        res,
        courseController.getEnrolledCourses.bind(courseController)
      )
  );
  router.get(
    "/:id",
    optionalAuth,
    validateRequest(getCourseByIdSchema),
    (req, res) =>
      expressAdapter(
        req,
        res,
        courseController.getCourseById.bind(courseController)
      )
  );
  router.put(
    "/:id",
    restrictTo("INSTRUCTOR", "ADMIN"),
    validateRequest(updateCourseSchema),
    (req, res) =>
      expressAdapter(
        req,
        res,
        courseController.updateCourse.bind(courseController)
      )
  );
  router.delete(
    "/:id",
    restrictTo("INSTRUCTOR", "ADMIN"),
    validateRequest(deleteCourseSchema),
    (req, res) =>
      expressAdapter(
        req,
        res,
        courseController.deleteCourse.bind(courseController)
      )
  );
  router.post(
    "/approve",
    restrictTo("ADMIN"),
    validateRequest(updateCourseApprovalSchema),
    (req, res) =>
      expressAdapter(
        req,
        res,
        courseController.approveCourse.bind(courseController)
      )
  );
  router.post(
    "/decline",
    restrictTo("ADMIN"),
    validateRequest(updateCourseApprovalSchema),
    (req, res) =>
      expressAdapter(
        req,
        res,
        courseController.declineCourse.bind(courseController)
      )
  );
  router.post(
    "/enroll",
    restrictTo("USER", "INSTRUCTOR", "ADMIN"),
    validateRequest(createEnrollmentSchema),
    (req, res) =>
      expressAdapter(
        req,
        res,
        courseController.enrollCourse.bind(courseController)
      )
  );

  return router;
}
