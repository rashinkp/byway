import { Router } from "express";
import { restrictTo, optionalAuth } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validate-request.middleware";

import { CourseReviewController } from "../../http/controllers/course-review.controller";
import { expressAdapter } from "../../adapters/express.adapter";

export default function courseReviewRouter(
  courseReviewController: CourseReviewController
): Router {
  const router = Router();

  // Create a new review
  router.post(
    "/",
    restrictTo("USER", "INSTRUCTOR", "ADMIN"),
    (req, res) =>
      expressAdapter(
        req,
        res,
        courseReviewController.createReview.bind(courseReviewController)
      )
  );

  // Update a review
  router.put(
    "/:id",
    restrictTo("USER", "INSTRUCTOR", "ADMIN"),
    (req, res) =>
      expressAdapter(
        req,
        res,
        courseReviewController.updateReview.bind(courseReviewController)
      )
  );

  // Delete a review (creator only)
  router.delete(
    "/:id",
    restrictTo("USER", "INSTRUCTOR", "ADMIN"),
    (req, res) =>
      expressAdapter(
        req,
        res,
        courseReviewController.deleteReview.bind(courseReviewController)
      )
  );

  // Get reviews for a course
  router.get(
    "/course/:courseId",
    optionalAuth,
    (req, res) =>
      expressAdapter(
        req,
        res,
        courseReviewController.getCourseReviews.bind(courseReviewController)
      )
  );

  // Get review stats for a course
  router.get(
    "/course/:courseId/stats",
    optionalAuth,
    (req, res) =>
      expressAdapter(
        req,
        res,
        courseReviewController.getCourseReviewStats.bind(courseReviewController)
      )
  );

  // Get my review for a specific course
  router.get(
    "/course/:courseId/my-review",
    restrictTo("USER", "INSTRUCTOR", "ADMIN"),
    (req, res) =>
      expressAdapter(
        req,
        res,
        courseReviewController.getMyReview.bind(courseReviewController)
      )
  );

  // Get all reviews by the current user
  router.get(
    "/my-reviews",
    restrictTo("USER", "INSTRUCTOR", "ADMIN"),
    (req, res) =>
      expressAdapter(
        req,
        res,
        courseReviewController.getUserReviews.bind(courseReviewController)
      )
  );

  // Admin: Disable/Enable a review
  router.patch(
    "/:id/disable",
    restrictTo("ADMIN"),
    (req, res) =>
      expressAdapter(
        req,
        res,
        courseReviewController.disableReview.bind(courseReviewController)
      )
  );

  return router;
} 