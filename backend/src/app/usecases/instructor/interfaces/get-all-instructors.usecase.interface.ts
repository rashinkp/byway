import { GetAllInstructorsRequestDTO, InstructorResponseDTO } from "../../../../domain/dtos/instructor/instructor.dto";

export interface IGetAllInstructorsUseCase {
  execute(
    dto: GetAllInstructorsRequestDTO
  ): Promise<{
    items: InstructorResponseDTO[];
    total: number;
    totalPages: number;
  }>;
}
