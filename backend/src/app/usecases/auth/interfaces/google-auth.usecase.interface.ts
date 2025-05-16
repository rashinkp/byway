import { User } from "../../../../domain/entities/user";


export interface IGoogleAuthUseCase {
  execute(accessToken: string): Promise<User>;
}
