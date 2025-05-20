import { User } from "../../../../domain/entities/user.entity";
import { IAuthRepository } from "../../../repositories/auth.repository";

import { IUpdateUserRequestDTO } from "../../../../domain/entities/user.entity";
import { IGoogleAuthUseCase } from "../interfaces/google-auth.usecase.interface";
import { HttpError } from "../../../../presentation/http/utils/HttpErrors";
import { Role } from "../../../../domain/enum/role.enum";
import { AuthProvider } from "../../../../domain/enum/auth-provider.enum";
import { GoogleAuthGateway, GoogleUserInfo } from "../../../providers/I.google-auth.provider";

export class GoogleAuthUseCase implements IGoogleAuthUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private googleAuthGateway: GoogleAuthGateway
  ) {}

  async execute(accessToken: string): Promise<User> {
    let googleUser: GoogleUserInfo;
    try {
      googleUser = await this.googleAuthGateway.getUserInfo(accessToken);
    } catch (error) {
      throw new HttpError("Invalid Google access token", 401);
    }

    let user = await this.authRepository.findUserByEmail(googleUser.email);

    try {
      if (!user) {
        // Create new user
        user = User.create({
          name: googleUser.name,
          email: googleUser.email,
          googleId: googleUser.googleId,
          role: Role.USER,
          authProvider: AuthProvider.GOOGLE,
          avatar: googleUser.picture,
        });
        user.verifyEmail(); // Google users are verified by default
        return await this.authRepository.createUser(user);
      }

      // Update existing user
      const updates: IUpdateUserRequestDTO = {
        id: user.id,
        googleId: googleUser.googleId,
        avatar: googleUser.picture,
        isVerified: true,
      };
      if (googleUser.name && googleUser.name !== user.name) {
        updates.name = googleUser.name;
      }
      user = User.update(user, updates);
      return await this.authRepository.updateUser(user);
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpError(error.message, 400);
      }
      throw new HttpError("Failed to process Google authentication", 500);
    }
  }
}
