import { ToggleDeleteUserDto } from "../../../dtos/user.dto";
import { User } from "../../../../domain/entities/user.entity";

export interface IToggleDeleteUserUseCase {
  execute(
    dto: ToggleDeleteUserDto,
    currentUser: { id: string; role: string }
  ): Promise<User>;
}
