import { JwtPayload } from "jsonwebtoken";
import { UpdateInstructorRequestDTO } from "../../../../domain/dtos/instructor/instructor.dto";
import { Instructor } from "../../../../domain/entities/instructor.entity";

export interface IUpdateInstructorUseCase {
  execute(
    dto: UpdateInstructorRequestDTO,
    requestingUser: JwtPayload
  ): Promise<Instructor>;

}
