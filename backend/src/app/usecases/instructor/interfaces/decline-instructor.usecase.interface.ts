import { DeclineInstructorRequestDTO } from "../../../dtos/instructor.dto";
import { Instructor } from "../../../../domain/entities/instructor.entity";
import { UserDTO } from "../../../dtos/general.dto";

export interface IDeclineInstructorUseCase {
  execute(
    dto: DeclineInstructorRequestDTO,
    requestingUser: UserDTO
  ): Promise<Instructor>;
}
