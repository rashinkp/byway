import { Role, AuthProvider } from "@prisma/client";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password?: string | null;
  googleId?: string | null;
  facebookId?: string | null;
  avatar?: string | null;
  role: Role;
  authProvider: AuthProvider;
  isVerified: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
} 