import { IUserRepository } from "../../../repositories/user.repository";
import { IGetTopInstructorsUseCase, ITopInstructor, IGetTopInstructorsInput } from "../interfaces/get-top-instructors.usecase.interface";

export class GetTopInstructorsUseCase implements IGetTopInstructorsUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: IGetTopInstructorsInput): Promise<ITopInstructor[]> {
    return this.userRepository.getTopInstructors(input);
  }
} 