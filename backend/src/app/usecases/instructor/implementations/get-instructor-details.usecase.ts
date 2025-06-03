import { GetInstructorDetailsUseCase } from "../interfaces/get-instructor-details.usecase.interface";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { IInstructorRepository } from "../../../repositories/instructor.repository";
import { IUserRepository } from "../../../repositories/user.repository";

export class GetInstructorDetailsUseCaseImpl implements GetInstructorDetailsUseCase {
  constructor(
    private readonly instructorRepository: IInstructorRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(instructorId: string) {
    const instructor = await this.instructorRepository.findInstructorById(instructorId);

    if (!instructor) {
      throw new HttpError("Instructor not found" , 404);
    }

    const userId = instructor.userId;
    if (!userId) {
      throw new HttpError("User ID not found for instructor", 404);
    }
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpError("User not found for instructor", 404);
    };



    return {
      id: instructor.id,
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
      createdAt: instructor.createdAt,
    };
  }
} 