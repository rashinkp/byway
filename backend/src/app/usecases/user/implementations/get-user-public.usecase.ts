import { GetUserDto, ProfileDTO, UserResponseDTO } from "../../../dtos/user.dto";
import { IUserRepository } from "../../../repositories/user.repository";
import { mapProfileToDTO, mapUserToDTO } from "../utils/user-dto-mapper";
import { UserNotFoundError } from "../../../../domain/errors/domain-errors";

export interface IGetPublicUserUseCase {
  execute(
    dto: GetUserDto
  ): Promise<{ user: UserResponseDTO; profile: ProfileDTO | null }>;
}

export class GetPublicUserUseCase implements IGetPublicUserUseCase {
  constructor(private _userRepository: IUserRepository) {}

  async execute(
    dto: GetUserDto
  ): Promise<{ user: UserResponseDTO; profile: ProfileDTO | null }> {
    const user = await this._userRepository.findById(dto.userId);
    if (!user) {
      throw new UserNotFoundError(dto.userId);
    }
    const profile = await this._userRepository.findProfileByUserId(dto.userId);
    return { user: mapUserToDTO(user)!, profile: mapProfileToDTO(profile) };
  }
}
