import { IInstructorRepository } from "./instructor.repository";

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

export class InstructorService {
  constructor(private instructorRepository: IInstructorRepository) {}

  async createInstructor(
    areaOfExpertise: string,
    professionalExperience: string,
    about: string,
    userId: string,
    website: string
  ): Promise<IInstructor> {
    
    if (
      !areaOfExpertise ||
      !professionalExperience ||
      !about ||
      !userId ||
      !website
    ) {
      throw new Error("All fields are required.");
    }

    return await this.instructorRepository.createInstructor(
      areaOfExpertise,
      professionalExperience,
      about,
      userId,
      website
    );
  }
}
