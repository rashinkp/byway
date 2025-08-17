import { GetInstructorDetailsUseCase } from "../interfaces/get-instructor-details.usecase.interface";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { IInstructorRepository } from "../../../repositories/instructor.repository";
import { IUserRepository } from "../../../repositories/user.repository";
import { CombinedInstructorDTO } from "../../../dtos/instructor.dto";

export class GetInstructorDetailsUseCaseImpl implements GetInstructorDetailsUseCase {
  constructor(
    private readonly _instructorRepository: IInstructorRepository,
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<CombinedInstructorDTO> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new HttpError("User not found for instructor", 404);
    }

    const instructor = await this._instructorRepository.findInstructorByUserId(
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
      about: instructor.about,
      website: instructor.website,
      education: instructor.education,
      certifications: instructor.certifications,
      cv: instructor.cv,
      totalStudents: instructor.totalStudents,
      status: instructor.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt ?? null,
    };
  }
} 