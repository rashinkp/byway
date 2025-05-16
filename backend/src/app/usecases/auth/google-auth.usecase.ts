import { User } from "../../../domain/entities/user";
import { IAuthRepository } from "../../repositories/auth.repository";
import {
  GoogleAuthGateway,
  GoogleUserInfo,
} from "../../../infra/providers/auth/google-auth.provider";
import { Role } from "../../../domain/enum/role.enum";
import { v4 as uuidv4 } from "uuid";

export class GoogleAuthUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private googleAuthGateway: GoogleAuthGateway
  ) {}

  async execute(accessToken: string): Promise<User> {
    // Fetch user info from Google
    const googleUser: GoogleUserInfo = await this.googleAuthGateway.getUserInfo(
      accessToken
    );

    let user = await this.authRepository.findUserByEmail(googleUser.email);

    if (!user) {
      // Create new user
      user = new User(
        uuidv4(),
        googleUser.name,
        googleUser.email,
        undefined, // No password for Google auth
        googleUser.googleId,
        undefined,
        Role.USER, // Default role, adjust as needed
        true, // Google users are verified by default
        new Date(),
        new Date(),
        googleUser.picture 
      );
      await this.authRepository.createUser(user);
    } else {
      // Update existing user (verified or not)
      const updates: Partial<User> = {
        googleId: googleUser.googleId,
        avatar: googleUser.picture,
        updatedAt: new Date(),
      };

      // Optionally update name if different (remove this if you want to preserve existing name)
      if (googleUser.name && googleUser.name !== user.name) {
        updates.name = googleUser.name;
      }

      user = {
        ...user,
        ...updates,
        isVerified: true, // Ensure user is verified
      };
      await this.authRepository.updateUser(user);
    }

    return user;
  }
}
