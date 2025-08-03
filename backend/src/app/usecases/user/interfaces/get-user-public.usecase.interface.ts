import { GetUserDto } from "../../../dtos/user/user.dto";
import { User } from "../../../../domain/entities/user.entity";
import { UserProfile } from "../../../../domain/entities/user-profile.entity";

export interface IGetPublicUserUseCase {
  execute(
    dto: GetUserDto
  ): Promise<{ user: User; profile: UserProfile | null }>;
}
