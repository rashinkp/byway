import { GetInstructorByUserIdRequestDTO } from "../../../dtos/instructor/instructor.dto";
import { Instructor } from "../../../../domain/entities/instructor.entity";
import { IInstructorRepository } from "../../../repositories/instructor.repository";
import { IGetInstructorByUserIdUseCase } from "../interfaces/get-instructor-by-Id.usecase.interface";

export class GetInstructorByUserIdUseCase
  implements IGetInstructorByUserIdUseCase
{
  constructor(private instructorRepository: IInstructorRepository) {}

  async execute(
    dto: GetInstructorByUserIdRequestDTO
  ): Promise<Instructor | null> {
    return this.instructorRepository.findInstructorByUserId(dto.userId);
  }
}
