import { JwtPayload } from "jsonwebtoken";
import { ApproveInstructorRequestDTO } from "../../../dtos/instructor.dto";
import { Instructor } from "../../../../domain/entities/instructor.entity";

export interface IApproveInstructorUseCase {
  execute(
    dto: ApproveInstructorRequestDTO,
    requestingUser: JwtPayload
  ): Promise<Instructor>;
}
