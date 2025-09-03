import { GetInstructorDetailsUseCase } from "../interfaces/get-instructor-details.usecase.interface";
import { IInstructorRepository } from "../../../repositories/instructor.repository";
import { IUserRepository } from "../../../repositories/user.repository";
import { CombinedInstructorDTO } from "../../../dtos/instructor.dto";
import { UserNotFoundError, NotFoundError } from "../../../../domain/errors/domain-errors";

export class GetInstructorDetailsUseCaseImpl implements GetInstructorDetailsUseCase {
  constructor(
    private readonly _instructorRepository: IInstructorRepository,
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<CombinedInstructorDTO> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const instructor = await this._instructorRepository.findInstructorByUserId(
      userId
    );

    if (!instructor) {
      throw new NotFoundError("Instructor", userId);
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