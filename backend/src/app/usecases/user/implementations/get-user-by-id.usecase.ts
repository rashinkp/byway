import { GetUserDto } from "../../../../domain/dtos/user/user.dto";
import { User } from "../../../../domain/entities/user.entity";
import { UserProfile } from "../../../../domain/entities/user-profile.entity";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { IUserRepository } from "../../../repositories/user.repository";
import { IGetUserByIdUseCase } from "../interfaces/get-user-by-id.usecase.interface";


export class GetUserByIdUseCase implements IGetUserByIdUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    dto: GetUserDto
  ): Promise<{ user: User; profile: UserProfile | null }> {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new HttpError("User not found", 404);
    }
    const profile = await this.userRepository.findProfileByUserId(dto.userId);
    return { user, profile };
  }
}
