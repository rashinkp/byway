import { User } from "../../domain/entities/user";
import { UserVerification } from "../../domain/entities/verification";

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<User | null>;
  findUserByGoogleId(googleId: string): Promise<User | null>;
  findUserByFacebookId(facebookId: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  createVerification(verification: UserVerification): Promise<UserVerification>;
  findVerificationByEmail(email: string): Promise<UserVerification | null>;
  updateVerification(verification: UserVerification): Promise<UserVerification>;
  updateUser(user: User): Promise<User>;
}
