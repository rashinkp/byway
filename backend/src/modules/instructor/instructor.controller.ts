import { InstructorService } from "./instructor.service";

interface CreateInstructorInput {
  areaOfExpertise: string;
  professionalExperience: string;
  about: string;
  userId: string;
  website: string;
}

interface InstructorResponse {
  status: "success" | "error";
  data?: { id: string; email: string; role: string };
  message: string; 
  statusCode: number; 
}

export class InstructorController {
  constructor(private instructorService: InstructorService) {}

  async createInstructor(
    input: CreateInstructorInput
  ): Promise<InstructorResponse> {
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

      return {
        status: "success",
        data: {
          id: instructor.id,
          email: instructor.email,
          role: instructor.role,
        },
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
