import { InstructorStats } from "../../../dtos/stats.dto";
import { IInstructorRepository } from "../../../repositories/instructor.repository";
import {
  IGetTopInstructorsUseCase,
  IGetTopInstructorsInput,
} from "../interfaces/get-top-instructors.usecase.interface";

export class GetTopInstructorsUseCase implements IGetTopInstructorsUseCase {
  constructor(private readonly instructorRepository: IInstructorRepository) {}

  async execute(input: IGetTopInstructorsInput): Promise<InstructorStats[]> {
    return this.instructorRepository.getTopInstructors(input);
  }
}
