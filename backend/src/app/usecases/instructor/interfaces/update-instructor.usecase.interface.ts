import { UpdateInstructorRequestDTO } from "../../../dtos/instructor.dto";
import { Instructor } from "../../../../domain/entities/instructor.entity";
import { UserDTO } from "../../../dtos/general.dto";

export interface IUpdateInstructorUseCase {
  execute(
    dto: UpdateInstructorRequestDTO,
    requestingUser: UserDTO
  ): Promise<Instructor>;
}
