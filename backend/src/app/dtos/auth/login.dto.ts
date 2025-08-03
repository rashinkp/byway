import { AuthProvider } from "../../../domain/enum/auth-provider.enum";

export interface LoginDto {
  email: string;
  password?: string;
  authProvider?: AuthProvider;
}
