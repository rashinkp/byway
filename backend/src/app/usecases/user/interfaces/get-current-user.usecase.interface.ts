import { User } from "../../../../domain/entities/user";

export interface IGetCurrentUserUseCase {
  execute(userId: string): Promise<User>;
}
