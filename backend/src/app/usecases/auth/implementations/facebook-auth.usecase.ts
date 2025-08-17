import { User } from "../../../../domain/entities/user.entity";
import { IAuthRepository } from "../../../repositories/auth.repository";
import { IFacebookAuthUseCase } from "../interfaces/facebook-auth.usecase.interface";
import { AuthProvider } from "../../../../domain/enum/auth-provider.enum";
import { Role } from "../../../../domain/enum/role.enum";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { IUpdateUserRequestDTO, UserResponseDTO } from "../../../dtos/user.dto";
import { FacebookAuthDto } from "../../../dtos/auth.dto";

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
        return await this._authRepository.createUser(user);
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
      return await this._authRepository.updateUser(user);
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpError(error.message, 400);
      }
      throw new HttpError("Failed to process Facebook authentication", 500);
    }
  }
}
