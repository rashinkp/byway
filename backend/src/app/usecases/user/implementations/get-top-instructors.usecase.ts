import { InstructorStatsDTO } from "../../../dtos/stats.dto";
import { IInstructorRepository } from "../../../repositories/instructor.repository";
import {
  IGetTopInstructorsUseCase,
  IGetTopInstructorsInput,
} from "../interfaces/get-top-instructors.usecase.interface";

export class GetTopInstructorsUseCase implements IGetTopInstructorsUseCase {
  constructor(private readonly _instructorRepository: IInstructorRepository) {}

  async execute(input: IGetTopInstructorsInput): Promise<InstructorStatsDTO[]> {
    return this._instructorRepository.getTopInstructors(input);
  }
}
