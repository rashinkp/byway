import { Role } from "@/domain/enum/role.enum";

export interface IUserRepository<T = any> {
  findAll()
  findById(id: string): Promise<T | null>;
  findByRole(role: Role): Promise<T[]>;
  save(user: T): Promise<T>;
}
