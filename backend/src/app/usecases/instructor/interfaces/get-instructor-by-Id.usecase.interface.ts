import { GetInstructorByUserIdRequestDTO } from "../../../dtos/instructor.dto";
import { Instructor } from "../../../../domain/entities/instructor.entity";

export interface IGetInstructorByUserIdUseCase {
  execute(dto: GetInstructorByUserIdRequestDTO): Promise<Instructor | null>;
}
