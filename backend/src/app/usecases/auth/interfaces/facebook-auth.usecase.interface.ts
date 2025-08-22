import { FacebookAuthDto } from "../../../dtos/auth.dto";
import { UserResponseDTO } from "../../../dtos/user.dto";

export interface IFacebookAuthUseCase {
  execute(dto: FacebookAuthDto): Promise<UserResponseDTO>;
}
