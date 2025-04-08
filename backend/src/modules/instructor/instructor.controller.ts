import { ApiResponse } from "../../types/response";
import { InstructorService } from "./instructor.service";
import { JwtUtil } from "../../utils/jwt.util";

interface CreateInstructorInput {
  areaOfExpertise: string;
  professionalExperience: string;
  about: string;
  userId: string;
  website: string;
}

export class InstructorController {
  constructor(private instructorService: InstructorService) {}

  async createInstructor(
    input: CreateInstructorInput
  ): Promise<ApiResponse > {
    const { areaOfExpertise, professionalExperience, about, userId, website } =
      input;
    try {
      const instructor = await this.instructorService.createInstructor(
        areaOfExpertise,
        professionalExperience,
        about,
        userId,
        website
      );

      const newToken = JwtUtil.generateToken({
        id: instructor.id,
        email: instructor.email,
        role: instructor.role, 
      });

      return {
        status: "success",
        data: {
          id: instructor.id,
          email: instructor.email,
          role: instructor.role,
        },
        token: newToken, 
        message: "Instructor created successfully",
        statusCode: 201,
      };
    } catch (error) {
      console.error("Instructor creation error:", error);
      return {
        status: "error",
        message:
          error instanceof Error ? error.message : "Instructor creation failed",
        statusCode: 400,
      };
    }
  }
}
