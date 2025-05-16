import { ToggleDeleteUserDto } from "../../../../domain/dtos/user/user.dto";
import { User } from "../../../../domain/entities/user";

export interface IToggleDeleteUserUseCase {
  execute(
    dto: ToggleDeleteUserDto,
    currentUser: { id: string; role: string }
  ): Promise<User>;
}