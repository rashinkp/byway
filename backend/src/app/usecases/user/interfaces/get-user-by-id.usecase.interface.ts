import { GetUserDto } from "../../../../domain/dtos/user/user.dto";
import { User } from "../../../../domain/entities/user.entity";
import { UserProfile } from "../../../../domain/entities/user-profile.entity";

export interface IGetUserByIdUseCase {
  execute(
    dto: GetUserDto
  ): Promise<{ user: User; profile: UserProfile | null }>;
}
