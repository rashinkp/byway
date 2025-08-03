import {
  GetAllInstructorsRequestDTO,
  InstructorResponseDTO,
} from "../../../dtos/instructor/instructor.dto";

export interface IGetAllInstructorsUseCase {
  execute(dto: GetAllInstructorsRequestDTO): Promise<{
    items: InstructorResponseDTO[];
    total: number;
    totalPages: number;
  }>;
}
