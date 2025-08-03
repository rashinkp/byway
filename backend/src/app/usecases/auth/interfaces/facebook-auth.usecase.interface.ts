import { FacebookAuthDto } from "../../../dtos/auth/facebook-auth.dto";
import { User } from "../../../../domain/entities/user.entity";

export interface IFacebookAuthUseCase {
  execute(dto: FacebookAuthDto): Promise<User>;
}
