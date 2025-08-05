import { UserRecord } from "../records/user.record";
import { UserVerificationRecord } from "../records/user-verification.record";

export interface IAuthRepository {
  findByEmail(email: string): Promise<UserRecord | null>;
  findByGoogleId(googleId: string): Promise<UserRecord | null>;
  findByFacebookId(facebookId: string): Promise<UserRecord | null>;
  createUser(user: UserRecord): Promise<UserRecord>;
  updateUser(user: UserRecord): Promise<UserRecord>;
  createVerification(verification: UserVerificationRecord): Promise<UserVerificationRecord>;
  findVerificationByEmail(email: string): Promise<UserVerificationRecord | null>;
  updateVerification(verification: UserVerificationRecord): Promise<UserVerificationRecord>;
}
