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
    (req, res) =>
      expressAdapter(
        req,
        res,
        courseController.getEnrolledCourses.bind(courseController)
      )
  );
  
  // Course statistics - must come before /:id route
  router.get(
    "/stats",
    optionalAuth,
    (req, res) =>
      expressAdapter(
        req,
        res,
        courseController.getCourseStats.bind(courseController)
      )
  );
  
  router.get(
    "/:id",
    optionalAuth,
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
    (req, res) =>
      expressAdapter(
        req,
        res,
        courseController.enrollCourse.bind(courseController)
      )
  );

  return router;
}
