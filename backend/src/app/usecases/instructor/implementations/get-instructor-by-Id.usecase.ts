import { GetInstructorByUserIdRequestDTO, InstructorResponseDTO } from "../../../dtos/instructor.dto";
import { Instructor } from "../../../../domain/entities/instructor.entity";
import { IInstructorRepository } from "../../../repositories/instructor.repository";
import { IGetInstructorByUserIdUseCase } from "../interfaces/get-instructor-by-Id.usecase.interface";

export class GetInstructorByUserIdUseCase implements IGetInstructorByUserIdUseCase {
  constructor(private _instructorRepository: IInstructorRepository) {}

  async execute(
    dto: GetInstructorByUserIdRequestDTO
  ): Promise<InstructorResponseDTO | null> {
    const instructor = await this._instructorRepository.findInstructorByUserId(dto.userId);
    if (!instructor) return null;
    
    return {
      id: instructor.id,
      userId: instructor.userId,
      areaOfExpertise: instructor.areaOfExpertise,
      professionalExperience: instructor.professionalExperience,
      about: instructor.about,
      website: instructor.website,
      education: instructor.education,
      certifications: instructor.certifications,
      cv: instructor.cv,
      status: instructor.status,
      totalStudents: instructor.totalStudents,
      createdAt: instructor.createdAt,
      updatedAt: instructor.updatedAt,
    };
  }
}
