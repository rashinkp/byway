import { GetInstructorDetailsUseCase } from "../interfaces/get-instructor-details.usecase.interface";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { IInstructorRepository } from "../../../repositories/instructor.repository";
import { IUserRepository } from "../../../repositories/user.repository";

export class GetInstructorDetailsUseCaseImpl implements GetInstructorDetailsUseCase {
  constructor(
    private readonly instructorRepository: IInstructorRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpError("User not found for instructor", 404);
    }

 

    const instructor = await this.instructorRepository.findInstructorByUserId(
      userId
    );

    if (!instructor) {
      throw new HttpError("Instructor not found", 404);
    }

    return {
      userId: user.id,
      instructorId: instructor.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar ?? null,
      areaOfExpertise: instructor.areaOfExpertise,
      professionalExperience: instructor.professionalExperience,
      about: instructor.about ?? null,
      website: instructor.website ?? null,
      education: instructor.education,
      certifications: instructor.certifications,
      cv: instructor.cv,
      totalStudents: instructor.totalStudents,
      status: instructor.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt ?? null
    };
  }
} 