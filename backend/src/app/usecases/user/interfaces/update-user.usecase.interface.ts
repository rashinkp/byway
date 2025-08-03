import { UpdateUserDto } from "../../../dtos/user/user.dto";
import { User } from "../../../../domain/entities/user.entity";
import { UserProfile } from "../../../../domain/entities/user-profile.entity";

export interface IUpdateUserUseCase {
  execute(
    dto: UpdateUserDto,
    userId: string
  ): Promise<{ user: User; profile: UserProfile | null }>;
}
