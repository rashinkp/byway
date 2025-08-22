import { GetUserDto, ProfileDTO, UserResponseDTO } from "../../../dtos/user.dto";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { IUserRepository } from "../../../repositories/user.repository";
import { mapProfileToDTO, mapUserToDTO } from "../utils/user-dto-mapper";

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
      throw new HttpError("User not found", 404);
    }
    const profile = await this._userRepository.findProfileByUserId(dto.userId);
    return { user: mapUserToDTO(user)!, profile: mapProfileToDTO(profile) };
  }
}
