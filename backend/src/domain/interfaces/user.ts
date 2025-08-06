import { AuthProvider } from "../enum/auth-provider.enum";
import { Role } from "../enum/role.enum";
import { Email } from "../value-object/email";

export interface UserProps {
  id: string;
  name: string;
  email: Email;
  password?: string;
  googleId?: string;
  facebookId?: string;
  role: Role;
  authProvider: AuthProvider;
  isVerified: boolean;
  avatar?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Interface for creating a new User
export interface CreateUserParams {
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  facebookId?: string;
  role?: Role;
  authProvider?: AuthProvider;
  avatar?: string;
}

// Interface for updating an existing User
export interface UpdateUserParams {
  name?: string;
  email?: string;
  password?: string;
  googleId?: string;
  facebookId?: string;
  role?: Role;
  authProvider?: AuthProvider;
  avatar?: string;
  isVerified?: boolean;
  deletedAt?: Date;
}
