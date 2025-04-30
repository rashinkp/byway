import { IAuthUser } from "./auth.types";

export interface IAuthRepository {
  createAdmin(
    name: string,
    email: string,
    password: string
  ): Promise<IAuthUser>;
  createUser(name: string, email: string, password: string): Promise<IAuthUser>;
  resetPassword(email: string, hashedPassword: string): Promise<void>;
  createGoogleUser(
    name: string,
    email: string,
    googleId: string
  ): Promise<IAuthUser>;
  createFacebookUser(
    name: string,
    email: string,
    picture: string,
    userId: string
  ): Promise<IAuthUser>;
}
