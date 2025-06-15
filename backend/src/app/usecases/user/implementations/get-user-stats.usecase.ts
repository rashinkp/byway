import { IUserRepository } from "../../../repositories/user.repository";
import { IGetUserStatsUseCase, IUserStats, IGetUserStatsInput } from "../interfaces/get-user-stats.usecase.interface";

export class GetUserStatsUseCase implements IGetUserStatsUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: IGetUserStatsInput): Promise<IUserStats> {
    return this.userRepository.getUserStats(input);
  }
} 