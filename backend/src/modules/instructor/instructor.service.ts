import { StatusCodes } from "http-status-codes";
import { AppError } from "../../utils/appError";
import { IInstructorRepository } from "./instructor.repository";
import { JwtUtil } from "../../utils/jwt.util";

export interface IInstructor {
  id: string; 
  email: string; 
  role: string; 
  areaOfExpertise: string;
  professionalExperience: string;
  about: string;
  userId: string;
  website: string;
}

type InstructorWithToken = IInstructor & { newToken: string };


export class InstructorService {
  constructor(
    private instructorRepository: IInstructorRepository,
    private jwtSecret: string
  ) {
    if (!jwtSecret) {
      throw new AppError(
        "JWT_SECRET not configured",
        StatusCodes.INTERNAL_SERVER_ERROR,
        "CONFIG_ERROR"
      );
    }
  }

  async createInstructor(
    areaOfExpertise: string,
    professionalExperience: string,
    about: string,
    userId: string,
    website: string
  ): Promise<InstructorWithToken> {
    if (
      !areaOfExpertise ||
      !professionalExperience ||
      !about ||
      !userId ||
      !website
    ) {
      throw new Error("All fields are required.");
    }

    const instructor = await this.instructorRepository.createInstructor(
      areaOfExpertise,
      professionalExperience,
      about,
      userId,
      website
    );

    const newToken = JwtUtil.generateToken(
      {
        id: instructor.id,
        email: instructor.email,
        role: instructor.role,
      },
      this.jwtSecret
    );

    return { ...instructor, newToken };
  }
}
