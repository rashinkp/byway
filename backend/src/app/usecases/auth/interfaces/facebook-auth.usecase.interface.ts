import { FacebookAuthDto } from "../../../../domain/dtos/auth/facebook-auth.dto";
import { User } from "../../../../domain/entities/user";


export interface IFacebookAuthUseCase {
  execute(dto: FacebookAuthDto): Promise<User>;
}
