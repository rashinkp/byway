
import { ApproveInstructorRequestDTO, InstructorResponseDTO } from "../../../dtos/instructor.dto";
import { UserDTO } from "../../../dtos/general.dto";

export interface IApproveInstructorUseCase {
  execute(
    dto: ApproveInstructorRequestDTO,
    requestingUser: UserDTO
  ): Promise<InstructorResponseDTO>;
}
