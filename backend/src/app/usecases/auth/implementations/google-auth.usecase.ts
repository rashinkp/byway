import { IAuthRepository } from "../../../repositories/auth.repository";

import { IGoogleAuthUseCase } from "../interfaces/google-auth.usecase.interface";
import { Role } from "../../../../domain/enum/role.enum";
import { AuthProvider } from "../../../../domain/enum/auth-provider.enum";
import {
  GoogleAuthGateway,
  GoogleUserInfo,
} from "../../../providers/google-auth.interface";
import { User } from "../../../../domain/entities/user.entity";
import { IUpdateUserRequestDTO, UserResponseDTO } from "../../../dtos/user.dto";
import { UserAuthenticationError, UserValidationError } from "../../../../domain/errors/domain-errors";

export class GoogleAuthUseCase implements IGoogleAuthUseCase {
  constructor(
    private _authRepository: IAuthRepository,
    private _googleAuthGateway: GoogleAuthGateway
  ) {}

  async execute(accessToken: string): Promise<UserResponseDTO> {
    let googleUser: GoogleUserInfo;
    try {
      googleUser = await this._googleAuthGateway.getUserInfo(accessToken);
    } catch {
      throw new UserAuthenticationError("Invalid Google access token");
    }

    let user = await this._authRepository.findUserByEmail(googleUser.email);

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
        const createdUser = await this._authRepository.createUser(user);
        return {
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
          role: createdUser.role,
          authProvider: createdUser.authProvider,
          isVerified: createdUser.isVerified,
          avatar: createdUser.avatar,
          deletedAt: createdUser.deletedAt,
          updatedAt: createdUser.updatedAt,
          createdAt: createdUser.createdAt,
        };
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
      const updatedUser = await this._authRepository.updateUser(user);
      return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        authProvider: updatedUser.authProvider,
        isVerified: updatedUser.isVerified,
        avatar: updatedUser.avatar,
        deletedAt: updatedUser.deletedAt,
        updatedAt: updatedUser.updatedAt,
        createdAt: updatedUser.createdAt,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new UserValidationError(error.message);
      }
      throw new UserValidationError("Failed to process Google authentication");
    }
  }
}
