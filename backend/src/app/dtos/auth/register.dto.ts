import { Role } from "../../../domain/enum/role.enum";

export interface RegisterDto {
  name: string;
  email: string;
  password?: string;
  role: Role;
}
