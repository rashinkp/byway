import { User } from "../../../../domain/entities/user.entity";

export interface IGetCurrentUserUseCase {
  execute(userId: string): Promise<{ user: User, cartCount: number }>;
}
