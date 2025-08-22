import { GetUserDto, ProfileDTO, UserResponseDTO } from "../../../dtos/user.dto";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { IUserRepository } from "../../../repositories/user.repository";
import { IGetUserByIdUseCase } from "../interfaces/get-user-by-id.usecase.interface";

export class GetUserByIdUseCase implements IGetUserByIdUseCase {
  constructor(private _userRepository: IUserRepository) {}

  async execute(
    dto: GetUserDto
  ): Promise<{ user: UserResponseDTO; profile: ProfileDTO | null }> {
    const user = await this._userRepository.findById(dto.userId);
    if (!user) {
      throw new HttpError("User not found", 404);
    }
    const profile = await this._userRepository.findProfileByUserId(dto.userId);
    return { user, profile };
  }
}
