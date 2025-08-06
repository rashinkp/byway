import { DeclineInstructorRequestDTO } from "../../../dtos/instructor.dto";
import { Instructor } from "../../../../domain/entities/instructor.entity";
import { JwtPayload } from "../../../../presentation/express/middlewares/auth.middleware";

export interface IDeclineInstructorUseCase {
  execute(
    dto: DeclineInstructorRequestDTO,
    requestingUser: JwtPayload
  ): Promise<Instructor>;
}
