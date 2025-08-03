import { CreateInstructorRequestDTO } from "../../../dtos/instructor/instructor.dto";
import { Instructor } from "../../../../domain/entities/instructor.entity";
import { JwtPayload } from "../../../../presentation/express/middlewares/auth.middleware";

export interface ICreateInstructorUseCase {
  execute(
    dto: CreateInstructorRequestDTO & { userId: string },
    requestingUser: JwtPayload
  ): Promise<Instructor>;
}
