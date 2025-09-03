import { User } from "../../../../domain/entities/user.entity";
import { IAuthRepository } from "../../../repositories/auth.repository";
import { IFacebookAuthUseCase } from "../interfaces/facebook-auth.usecase.interface";
import { AuthProvider } from "../../../../domain/enum/auth-provider.enum";
import { Role } from "../../../../domain/enum/role.enum";
import { IUpdateUserRequestDTO, UserResponseDTO } from "../../../dtos/user.dto";
import { FacebookAuthDto } from "../../../dtos/auth.dto";
import { UserValidationError } from "../../../../domain/errors/domain-errors";

export class FacebookAuthUseCase implements IFacebookAuthUseCase {
  constructor(private _authRepository: IAuthRepository) {}

  async execute(dto: FacebookAuthDto): Promise<UserResponseDTO> {
    const { userId, name, email, picture } = dto;

    // Use email if provided, otherwise generate a placeholder
    const userEmail = email || `${userId}@facebook.com`;

    let user = await this._authRepository.findUserByEmail(userEmail);

    try {
      if (!user) {
        // Create new user
        user = User.create({
          name,
          email: userEmail,
          facebookId: userId,
          role: Role.USER,
          authProvider: AuthProvider.FACEBOOK,
          avatar: picture,
        });
        user.verifyEmail(); // Facebook users are verified by default
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

      const updates: IUpdateUserRequestDTO = {
        id: user.id,
        facebookId: userId,
        avatar: picture,
        isVerified: true,
      };
      if (name && name !== user.name) {
        updates.name = name;
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
      throw new UserValidationError("Failed to process Facebook authentication");
    }
  }
}
