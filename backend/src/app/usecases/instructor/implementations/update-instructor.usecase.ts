import { InstructorResponseDTO, UpdateInstructorRequestDTO } from "../../../dtos/instructor.dto";
import { Instructor } from "../../../../domain/entities/instructor.entity";
import { Role } from "../../../../domain/enum/role.enum";
import { IInstructorRepository } from "../../../repositories/instructor.repository";
import { IUpdateInstructorUseCase } from "../interfaces/update-instructor.usecase.interface";
import { UserDTO } from "../../../dtos/general.dto";
import { NotFoundError, UserAuthorizationError } from "../../../../domain/errors/domain-errors";

export class UpdateInstructorUseCase implements IUpdateInstructorUseCase {
  constructor(
    private _instructorRepository: IInstructorRepository,
  ) {}

  async execute(
    dto: UpdateInstructorRequestDTO,
    requestingUser: UserDTO
  ): Promise<InstructorResponseDTO> {
    const instructor = await this._instructorRepository.findInstructorById(
      dto.id
    );
    if (!instructor) {
      throw new NotFoundError("Instructor", dto.id);
    }

    if (
      instructor.userId !== requestingUser.id &&
      requestingUser.role !== Role.ADMIN
    ) {
      throw new UserAuthorizationError(
        "Unauthorized: Cannot update another instructor's details"
      );
    }

    const updatedInstructor = Instructor.update(instructor, dto);
    const updatedInstructorResult = await this._instructorRepository.updateInstructor(updatedInstructor);
    return {
      id: updatedInstructorResult.id,
      userId: updatedInstructorResult.userId,
      areaOfExpertise: updatedInstructorResult.areaOfExpertise,
      professionalExperience: updatedInstructorResult.professionalExperience,
      about: updatedInstructorResult.about,
      website: updatedInstructorResult.website,
      education: updatedInstructorResult.education,
      certifications: updatedInstructorResult.certifications,
      cv: updatedInstructorResult.cv,
      status: updatedInstructorResult.status,
      totalStudents: updatedInstructorResult.totalStudents,
      createdAt: updatedInstructorResult.createdAt,
      updatedAt: updatedInstructorResult.updatedAt,
    };
  }
}
