export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password?: string | null;
  googleId?: string | null;
  facebookId?: string | null;
  avatar?: string | null;
  role: "USER" | "INSTRUCTOR" | "ADMIN";
  authProvider: "EMAIL_PASSWORD" | "GOOGLE" | "FACEBOOK";
  isVerified: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
} 