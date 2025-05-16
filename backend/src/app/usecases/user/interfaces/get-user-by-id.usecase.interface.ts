import { GetUserDto } from "../../../../domain/dtos/user/user.dto";
import { User } from "../../../../domain/entities/user";
import { UserProfile } from "../../../../domain/entities/user-profile";


export interface IGetUserByIdUseCase {
  execute(
    dto: GetUserDto
  ): Promise<{ user: User; profile: UserProfile | null }>;
}