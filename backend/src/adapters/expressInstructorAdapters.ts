import { Request, Response , RequestHandler } from "express";
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
    const { areaOfExpertise, professionalExperience, about, website } =
    req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized: No user ID found in token",
      });
    }

    const result = await controller.createInstructor({
      areaOfExpertise,
      professionalExperience,
      about,
      userId,
      website,
    });

    res.status(result.statusCode as number).json({
      status: result.status,
      data: result.data,
      message: result.message,
    }) 
  }) as RequestHandler,
});
