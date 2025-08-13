
import { ApproveInstructorRequestDTO } from "../../../dtos/instructor.dto";
import { Instructor } from "../../../../domain/entities/instructor.entity";
import { UserDTO } from "../../../dtos/general.dto";

export interface IApproveInstructorUseCase {
  execute(
    dto: ApproveInstructorRequestDTO,
    requestingUser: UserDTO
  ): Promise<Instructor>;
}
