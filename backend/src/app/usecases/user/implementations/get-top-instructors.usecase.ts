import { IInstructorRepository } from "../../../repositories/instructor.repository";
import {
  IGetTopInstructorsUseCase,
  ITopInstructor,
  IGetTopInstructorsInput,
} from "../interfaces/get-top-instructors.usecase.interface";

export class GetTopInstructorsUseCase implements IGetTopInstructorsUseCase {
  constructor(private readonly instructorRepository: IInstructorRepository) {}

  async execute(input: IGetTopInstructorsInput): Promise<ITopInstructor[]> {
    return this.instructorRepository.getTopInstructors(input);
  }
}
