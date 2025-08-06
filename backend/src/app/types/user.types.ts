import { Role } from "@/domain/enum/role.enum";
import { AuthProvider } from "@/domain/enum/auth-provider.enum";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  password: string | null;
  googleId: string | null;
  facebookId: string | null;
  role: Role;
  authProvider: AuthProvider;
  isVerified: boolean;
  avatar: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
