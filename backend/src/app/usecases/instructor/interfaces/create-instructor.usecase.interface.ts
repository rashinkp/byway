import { CreateInstructorRequestDTO } from "../../../dtos/instructor.dto";
import { Instructor } from "../../../../domain/entities/instructor.entity";
import { UserDTO } from "../../../dtos/general.dto";

export interface ICreateInstructorUseCase {
  execute(
    dto: CreateInstructorRequestDTO & { userId: string },
    requestingUser: UserDTO
  ): Promise<Instructor>;
}
