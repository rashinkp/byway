import { User } from "../entities/user.entity";
import { UserVerification } from "../entities/user-verification.entity";

export interface IAuthRepository {
  // ... existing methods ...
  findVerificationByEmail(email: string): Promise<UserVerification | null>;
} 