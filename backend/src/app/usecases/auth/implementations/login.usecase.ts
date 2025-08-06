import { User } from "../../../../domain/entities/user.entity";
import { IAuthRepository } from "../../../repositories/auth.repository";
import { ICartRepository } from "../../../repositories/cart.repository";
import { UserMapper } from "../../../mappers/user.mapper";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { AuthProvider } from "../../../../domain/enum/auth-provider.enum";
import { LoginRequestDto } from "../../../dtos/auth.dto";
import { ILoginUseCase } from "../interfaces/login.usecase.interface";
import * as bcrypt from "bcrypt";

export class LoginUseCase implements ILoginUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private cartRepository: ICartRepository
  ) {}

  async execute(dto: LoginRequestDto): Promise<{ user: User; cartCount: number }> {
    try {
      // Get user record from repository
      const userRecord = await this.authRepository.findUserByEmail(dto.email);
      if (!userRecord) {
        throw new HttpError("Invalid credentials", 401);
      }

            // Convert record to domain entity
      const user = UserMapper.toDomain(userRecord);

      // Validate credentials based on auth provider
      if (dto.authProvider === AuthProvider.GOOGLE) {
        if (!user.googleId || !dto.googleId) {
          throw new HttpError("Invalid Google credentials", 401);
        }
      } else if (dto.authProvider === AuthProvider.FACEBOOK) {
        if (!user.facebookId || !dto.facebookId) {
          throw new HttpError("Invalid Facebook credentials", 401);
        }
      } else {
        // Email/Password authentication
        if (!dto.password || !user.password) {
          throw new HttpError("Invalid credentials", 401);
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
          throw new HttpError("Invalid credentials", 401);
        }
      }

      // Validate user can login
      if (!user.isVerified) {
        throw new HttpError("Email not verified", 403);
      }
      if (user.isDeleted()) {
        throw new HttpError("User account is disabled", 401);
      }

      // Get cart count
      const cartCount = await this.cartRepository.countByUserId(user.id);

      return {
        user,
        cartCount,
      };
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError("Login failed", 500);
    }
  }
}
