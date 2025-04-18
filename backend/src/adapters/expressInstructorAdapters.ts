import { Request, Response, RequestHandler } from "express";
import { AppError } from "../utils/appError";
import { StatusCodes } from "http-status-codes";
import { logger } from "../utils/logger";
import { JwtUtil } from "../utils/jwt.util";
import { InstructorController } from "../modules/instructor/instructor.controller";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const adaptInstructorController = (
  controller: InstructorController
) => ({
  createInstructor: (async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user?.id) {
      logger.error("Unauthorized: No user ID found in token", {
        request: req.body,
      });
      throw new AppError(
        "Unauthorized: No user ID found in token",
        StatusCodes.UNAUTHORIZED,
        "UNAUTHORIZED"
      );
    }

    const result = await controller.createInstructor({
      areaOfExpertise: req.body.areaOfExpertise,
      professionalExperience: req.body.professionalExperience,
      about: req.body.about,
      userId: req.user.id,
      website: req.body.website,
    });

    if (result.status === "success" && result.token) {
      JwtUtil.setTokenCookie(res, result.token);
    }

    res.status(result.statusCode as number).json({
      status: result.status,
      data: result.data,
      message: result.message,
    });
  }) as RequestHandler,
});
