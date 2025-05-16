import { GetUserDto } from "../../../../domain/dtos/user/user.dto";
import { User } from "../../../../domain/entities/user";
import { UserProfile } from "../../../../domain/entities/user-profile";
import { HttpError } from "../../../../presentation/http/utils/HttpErrors";
import { IUserRepository } from "../../../repositories/user.repository";

export interface IGetPublicUserUseCase {
  execute(
    dto: GetUserDto
  ): Promise<{ user: User; profile: UserProfile | null }>;
}

export class GetPublicUserUseCase implements IGetPublicUserUseCase {
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
