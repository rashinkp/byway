import { UpdateUserDto } from "../../../../domain/dtos/user/user.dto";
import { User } from "../../../../domain/entities/user";
import { UserProfile } from "../../../../domain/entities/user-profile";


export interface IUpdateUserUseCase {
  execute(
    dto: UpdateUserDto,
    userId: string
  ): Promise<{ user: User; profile: UserProfile | null }>;
}
