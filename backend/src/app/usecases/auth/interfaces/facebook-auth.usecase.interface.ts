
import { FacebookAuthRequestDto } from "@/app/dtos/auth.dto";
import { User } from "../../../../domain/entities/user.entity";

export interface IFacebookAuthUseCase {
  execute(dto: FacebookAuthRequestDto): Promise<User>;
}
