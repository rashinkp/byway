import { CombinedInstructorDTO } from "../../../dtos/instructor.dto";

export interface GetInstructorDetailsUseCase {
  execute(instructorId: string): Promise<CombinedInstructorDTO>;
} 