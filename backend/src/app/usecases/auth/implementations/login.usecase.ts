import { User } from "../../../../domain/entities/user.entity";
import { IAuthRepository } from "../../../repositories/auth.repository";
import * as bcrypt from "bcrypt";
import { AuthProvider } from "../../../../domain/enum/auth-provider.enum";
import { ILoginUseCase } from "../interfaces/login.usecase.interface";
import { ICartRepository } from "../../../repositories/cart.repository";
import { LoginDto, AuthUserDTO } from "../../../dtos/auth.dto";
import { mapUserToAuthUserDTO } from "../../user/utils/user-dto-mapper";
import { 
  UserNotFoundError, 
  UserAuthenticationError, 
  UserAuthorizationError 
} from "../../../../domain/errors/domain-errors";

export class LoginUseCase implements ILoginUseCase {
  constructor(
    private _authRepository: IAuthRepository,
    private _cartRepository: ICartRepository
  ) {}

  async execute(dto: LoginDto): Promise<{ user: AuthUserDTO; cartCount: number }> {
    const user = await this._authRepository.findUserByEmail(dto.email);
    if (!user) {
      throw new UserAuthenticationError("Invalid credentials");
    }

    try {
      if (dto.authProvider === AuthProvider.GOOGLE) {
        if (!user.googleId) {
          throw new UserAuthenticationError("Invalid Google credentials");
        }
      } else if (dto.authProvider === AuthProvider.FACEBOOK) {
        if (!user.facebookId) {
          throw new UserAuthenticationError("Invalid Facebook credentials");
        }
      } else {
        if (!dto.password || !user.password) {
          throw new UserAuthenticationError("Invalid credentials");
        }
        const isPasswordValid = await bcrypt.compare(
          dto.password,
          user.password
        );
        if (!isPasswordValid) {
          throw new UserAuthenticationError("Invalid credentials");
        }
      }

      if (!user.isVerified) {
        throw new UserAuthorizationError("Email not verified");
      }
      if (user.deletedAt) {
        throw new UserAuthenticationError("User account is disabled");
      }

      const cartCount = await this._cartRepository.countByUserId(user.id);

      const userDto = mapUserToAuthUserDTO(user);
      return { user: userDto, cartCount };
    } catch (error) {
      if (error instanceof UserAuthenticationError || 
          error instanceof UserAuthorizationError) {
        throw error;
      }
      throw new UserAuthenticationError("Login failed");
    }
  }
}
