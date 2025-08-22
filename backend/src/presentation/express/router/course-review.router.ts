import { Router } from "express";
import { restrictTo, optionalAuth } from "../middlewares/auth.middleware";

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
    (req, res , next) =>
      expressAdapter(
        req,
        res,
        courseReviewController.createReview.bind(courseReviewController) , next
      )
  );

  // Update a review


  // Delete a review (creator only)


  // Get reviews for a course (with optional isMyReviews filter)


  // Get all reviews by the current user (for profile)
  router.get(
    "/my-reviews",
    restrictTo("USER", "INSTRUCTOR", "ADMIN"),
    (req, res , next) =>
      expressAdapter(
        req,
        res,
        courseReviewController.getUserReviews.bind(courseReviewController) , next
      )
  );


  router.get("/course/:courseId", optionalAuth, (req, res , next) =>
    expressAdapter(
      req,
      res,
      courseReviewController.getCourseReviews.bind(courseReviewController) , next
    )
  );

  // Get review stats for a course
  router.get(
    "/course/:courseId/stats",
    optionalAuth,
    (req, res , next) =>
      expressAdapter(
        req,
        res,
        courseReviewController.getCourseReviews.bind(courseReviewController) , next
      )
  );

  // Admin: Disable/Enable a review
  router.patch(
    "/:id/disable",
    restrictTo("ADMIN"),
    (req, res , next) =>
      expressAdapter(
        req,
        res,
        courseReviewController.disableReview.bind(courseReviewController) , next
      )
  );





  router.delete("/:id", restrictTo("USER", "INSTRUCTOR", "ADMIN"), (req, res , next) =>
    expressAdapter(
      req,
      res,
      courseReviewController.deleteReview.bind(courseReviewController) , next
    )
  );



  router.put("/:id", restrictTo("USER", "INSTRUCTOR", "ADMIN"), (req, res , next) =>
    expressAdapter(
      req,
      res,
      courseReviewController.updateReview.bind(courseReviewController) ,next
    )
  );

  return router;
} 