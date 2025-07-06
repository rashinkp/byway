import { Router } from "express";
import { restrictTo, optionalAuth } from "../middlewares/auth.middleware";

import { CourseController } from "../../http/controllers/course.controller";
import { expressAdapter } from "../../adapters/express.adapter";

export default function courseRouter(
  courseController: CourseController
): Router {
  const router = Router();

  router.post(
    "/",
    restrictTo("INSTRUCTOR", "ADMIN"),
    (req, res, next) =>
      expressAdapter(
        req,
        res,
        courseController.createCourse.bind(courseController),
        next
      )
  );
  router.get(
    "/",
    optionalAuth,
    (req, res, next) =>
      expressAdapter(
        req,
        res,
        courseController.getAllCourses.bind(courseController),
        next
      )
  );
  router.get(
    "/enrolled",
    restrictTo("USER", "INSTRUCTOR", "ADMIN"),
    (req, res, next) =>
      expressAdapter(
        req,
        res,
        courseController.getEnrolledCourses.bind(courseController),
        next
      )
  );
  
  // Course statistics - must come before /:id route
  router.get(
    "/stats",
    optionalAuth,
    (req, res, next) =>
      expressAdapter(
        req,
        res,
        courseController.getCourseStats.bind(courseController),
        next
      )
  );
  
  router.get(
    "/:id",
    optionalAuth,
    (req, res, next) =>
      expressAdapter(
        req,
        res,
        courseController.getCourseById.bind(courseController),
        next
      )
  );
  router.put(
    "/:id",
    restrictTo("INSTRUCTOR", "ADMIN"),
    (req, res, next) =>
      expressAdapter(
        req,
        res,
        courseController.updateCourse.bind(courseController),
        next
      )
  );
  router.delete(
    "/:id",
    restrictTo("INSTRUCTOR", "ADMIN"),
    (req, res, next) =>
      expressAdapter(
        req,
        res,
        courseController.deleteCourse.bind(courseController),
        next
      )
  );
  router.post(
    "/approve",
    restrictTo("ADMIN"),
    (req, res, next) =>
      expressAdapter(
        req,
        res,
        courseController.approveCourse.bind(courseController),
        next
      )
  );
  router.post(
    "/decline",
    restrictTo("ADMIN"),
    (req, res, next) =>
      expressAdapter(
        req,
        res,
        courseController.declineCourse.bind(courseController),
        next
      )
  );
  router.post(
    "/enroll",
    restrictTo("USER", "INSTRUCTOR", "ADMIN"),
    (req, res, next) =>
      expressAdapter(
        req,
        res,
        courseController.enrollCourse.bind(courseController),
        next
      )
  );

  return router;
}
