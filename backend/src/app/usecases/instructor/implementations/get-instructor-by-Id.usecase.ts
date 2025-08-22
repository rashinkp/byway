import { GetInstructorByUserIdRequestDTO, InstructorResponseDTO } from "../../../dtos/instructor.dto";
import { Instructor } from "../../../../domain/entities/instructor.entity";
import { IInstructorRepository } from "../../../repositories/instructor.repository";
import { IGetInstructorByUserIdUseCase } from "../interfaces/get-instructor-by-Id.usecase.interface";

export class GetInstructorByUserIdUseCase implements IGetInstructorByUserIdUseCase {
  constructor(private _instructorRepository: IInstructorRepository) {}

  async execute(
    dto: GetInstructorByUserIdRequestDTO
  ): Promise<InstructorResponseDTO | null> {
    return this._instructorRepository.findInstructorByUserId(dto.userId);
  }
}
