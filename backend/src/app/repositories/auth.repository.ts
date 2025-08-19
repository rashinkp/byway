import { UserVerification } from "../../domain/entities/user-verification.entity";
import { User } from "../../domain/entities/user.entity";
import { IGenericRepository } from "./base/generic-repository.interface";

export interface IAuthRepository extends IGenericRepository<User> {
  findUserByEmail(email: string): Promise<User | null>;
  findUserByGoogleId(googleId: string): Promise<User | null>;
  findUserByFacebookId(facebookId: string): Promise<User | null>;
  createUser(user: User): Promise<User>;
  createVerification(verification: UserVerification): Promise<UserVerification>;
  findVerificationByEmail(email: string): Promise<UserVerification | null>;
  updateVerification(verification: UserVerification): Promise<UserVerification>;
  updateUser(user: User): Promise<User>;
}
