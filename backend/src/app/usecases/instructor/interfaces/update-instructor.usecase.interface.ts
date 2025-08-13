import { InstructorResponseDTO, UpdateInstructorRequestDTO } from "../../../dtos/instructor.dto";
import { UserDTO } from "../../../dtos/general.dto";

export interface IUpdateInstructorUseCase {
  execute(
    dto: UpdateInstructorRequestDTO,
    requestingUser: UserDTO
  ): Promise<InstructorResponseDTO>;
}
