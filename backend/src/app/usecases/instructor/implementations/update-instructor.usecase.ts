import { InstructorResponseDTO, UpdateInstructorRequestDTO } from "../../../dtos/instructor.dto";
import { Instructor } from "../../../../domain/entities/instructor.entity";
import { Role } from "../../../../domain/enum/role.enum";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { IInstructorRepository } from "../../../repositories/instructor.repository";
import { IUpdateInstructorUseCase } from "../interfaces/update-instructor.usecase.interface";
import { UserDTO } from "../../../dtos/general.dto";

export class UpdateInstructorUseCase implements IUpdateInstructorUseCase {
  constructor(
    private instructorRepository: IInstructorRepository,
  ) {}

  async execute(
    dto: UpdateInstructorRequestDTO,
    requestingUser: UserDTO
  ): Promise<InstructorResponseDTO> {
    const instructor = await this.instructorRepository.findInstructorById(
      dto.id
    );
    if (!instructor) {
      throw new HttpError("Instructor not found", 404);
    }

    if (
      instructor.userId !== requestingUser.id &&
      requestingUser.role !== Role.ADMIN
    ) {
      throw new HttpError(
        "Unauthorized: Cannot update another instructor's details",
        403
      );
    }

    const updatedInstructor = Instructor.update(instructor, dto);
    return this.instructorRepository.updateInstructor(updatedInstructor);
  }
}
