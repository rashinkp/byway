import { User } from "../../domain/entities/user.entity";
import { UserVerification } from "../../domain/entities/user-verification.entity";
import { UserRecord } from "../records/user.record";
import { UserVerificationRecord } from "../records/user-verification.record";

export interface IAuthRepository {
  // User methods - working with records for infrastructure
  findUserByEmail(email: string): Promise<UserRecord | null>;
  findUserByGoogleId(googleId: string): Promise<UserRecord | null>;
  findUserByFacebookId(facebookId: string): Promise<UserRecord | null>;
  createUser(user: User): Promise<UserRecord>;
  updateUser(user: User): Promise<UserRecord>;
  
  // Verification methods - working with records for infrastructure
  createVerification(verification: UserVerification): Promise<UserVerificationRecord>;
  findVerificationByEmail(email: string): Promise<UserVerificationRecord | null>;
  updateVerification(verification: UserVerification): Promise<UserVerificationRecord>;
}
