import { Role, AuthProvider } from "@prisma/client";

export type DbUser = {
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
