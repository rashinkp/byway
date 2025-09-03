import { GetUserDto, ProfileDTO, UserResponseDTO } from "../../../dtos/user.dto";
import { IUserRepository } from "../../../repositories/user.repository";
import { IGetUserByIdUseCase } from "../interfaces/get-user-by-id.usecase.interface";
import { mapProfileToDTO, mapUserToDTO } from "../utils/user-dto-mapper";
import { UserNotFoundError } from "../../../../domain/errors/domain-errors";

export class GetUserByIdUseCase implements IGetUserByIdUseCase {
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
