import { CreateInstructorRequestDTO, InstructorResponseDTO } from "../../../dtos/instructor.dto";
import { UserDTO } from "../../../dtos/general.dto";

export interface ICreateInstructorUseCase {
  execute(
    dto: CreateInstructorRequestDTO & { userId: string },
    requestingUser: UserDTO
  ): Promise<InstructorResponseDTO>;
}
