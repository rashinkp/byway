import { IGetUserStatsInputDTO, IUserStatsDTO } from "../../../dtos/user.dto";
import { IUserRepository } from "../../../repositories/user.repository";
import { IGetUserStatsUseCase } from "../interfaces/get-user-stats.usecase.interface";

export class GetUserStatsUseCase implements IGetUserStatsUseCase {
  constructor(private readonly _userRepository: IUserRepository) {}

  async execute(input: IGetUserStatsInputDTO): Promise<IUserStatsDTO> {
    return this._userRepository.getUserStats(input);
  }
} 