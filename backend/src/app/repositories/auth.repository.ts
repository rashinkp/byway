import { UserVerificationRecord } from "../records/user-verification.record";
import { UserRecord } from "../records/user.record";

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<UserRecord | null>;
  findUserByGoogleId(googleId: string): Promise<UserRecord | null>;
  findUserByFacebookId(facebookId: string): Promise<UserRecord | null>;
  createUser(user: UserRecord): Promise<UserRecord>;
  createVerification(verification: UserVerificationRecord): Promise<UserVerificationRecord>;
  findVerificationByEmail(email: string): Promise<UserVerificationRecord | null>;
  updateVerification(verification: UserVerificationRecord): Promise<UserVerificationRecord>;
  updateUser(user: UserRecord): Promise<UserRecord>;
}
