import { User } from "@/domain/entities/user.entity";
import { Role } from "@/domain/enum/role.enum";

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByRole(role: Role): Promise<User[]>;
  save(user: User): Promise<User>;
}
