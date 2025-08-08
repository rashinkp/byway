
import { User } from "../../../../domain/entities/user.entity";
import { FacebookAuthDto } from "../../../dtos/auth.dto";

export interface IFacebookAuthUseCase {
  execute(dto: FacebookAuthDto): Promise<User>;
}
