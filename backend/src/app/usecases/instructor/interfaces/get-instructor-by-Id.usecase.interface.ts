import { GetInstructorByUserIdRequestDTO, InstructorResponseDTO } from "../../../dtos/instructor.dto";

export interface IGetInstructorByUserIdUseCase {
  execute(
    dto: GetInstructorByUserIdRequestDTO
  ): Promise<InstructorResponseDTO | null>;
}
