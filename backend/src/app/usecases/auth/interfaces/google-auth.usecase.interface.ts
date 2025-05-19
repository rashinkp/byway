import { User } from "../../../../domain/entities/user.entity";

export interface IGoogleAuthUseCase {
  execute(accessToken: string): Promise<User>;
}
