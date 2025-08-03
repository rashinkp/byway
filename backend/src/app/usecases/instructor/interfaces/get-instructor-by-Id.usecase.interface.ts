import { GetInstructorByUserIdRequestDTO } from "../../../dtos/instructor/instructor.dto";
import { Instructor } from "../../../../domain/entities/instructor.entity";

export interface IGetInstructorByUserIdUseCase {
  execute(dto: GetInstructorByUserIdRequestDTO): Promise<Instructor | null>;
}
