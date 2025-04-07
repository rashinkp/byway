import { PrismaClient } from "@prisma/client";
import { IInstructor } from "./instructor.service";

export interface IInstructorRepository {
  createInstructor(
    areaOfExpertise: string,
    professionalExperience: string,
    about: string,
    userId: string,
    website: string
  ): Promise<IInstructor>;
}

export class InstructorRepository implements IInstructorRepository {
  constructor(private prisma: PrismaClient) {}

  async createInstructor(
    areaOfExpertise: string,
    professionalExperience: string,
    about: string,
    userId: string,
    website: string
  ): Promise<IInstructor> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }


    //implementing transaction to make sure things are happening atomicitly
    const result = await this.prisma.$transaction(async (tx) => {

      //changing user role
      if (user.role !== 'INSTRUCTOR') {
        await tx.user.update({
          where: { id: userId },
          data: { role: 'INSTRUCTOR' }
        });
      }

      //create instructorDetails 
      const instructorDetails = await tx.instructorDetails.create({
        data: {
          areaOfExpertise,
          professionalExperience,
          about,
          userId,
          website,
        },
      })

      return {
        id: user.id,
        email: user.email,
        role: "INSTRUCTOR",
        areaOfExpertise: instructorDetails.areaOfExpertise,
        professionalExperience: instructorDetails.professionalExperience,
        about: instructorDetails.about as string,
        userId: instructorDetails.userId,
        website: instructorDetails.website as string,
      };


    })

    return result;
  }
}
