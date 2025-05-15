import { Role } from "../../enum/role.enum";

export interface RegisterDto {
  name: string;
  email: string;
  password?: string; 
  role:Role;
}
