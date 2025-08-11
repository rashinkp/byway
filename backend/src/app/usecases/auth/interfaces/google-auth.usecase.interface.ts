import { User } from "../../../../domain/entities/user.entity";
import { UserResponseDTO } from "../../../dtos/user.dto";

export interface IGoogleAuthUseCase {
  execute(accessToken: string): Promise<UserResponseDTO>;
}
