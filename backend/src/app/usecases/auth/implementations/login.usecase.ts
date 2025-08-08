import { User } from "../../../../domain/entities/user.entity";
import { IAuthRepository } from "../../../repositories/auth.repository";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import * as bcrypt from "bcrypt";
import { AuthProvider } from "../../../../domain/enum/auth-provider.enum";
import { ILoginUseCase } from "../interfaces/login.usecase.interface";
import { ICartRepository } from "../../../repositories/cart.repository";
import { LoginDto } from "../../../dtos/auth.dto";

export class LoginUseCase implements ILoginUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private cartRepository: ICartRepository
  ) {}

  async execute(dto: LoginDto): Promise<{ user: User; cartCount: number }> {
    const user = await this.authRepository.findUserByEmail(dto.email);
    if (!user) {
      throw new HttpError("Invalid credentials", 401);
    }

    try {
      if (dto.authProvider === AuthProvider.GOOGLE) {
        if (!user.googleId) {
          throw new HttpError("Invalid Google credentials", 401);
        }
      } else if (dto.authProvider === AuthProvider.FACEBOOK) {
        if (!user.facebookId) {
          throw new HttpError("Invalid Facebook credentials", 401);
        }
      } else {
        if (!dto.password || !user.password) {
          throw new HttpError("Invalid credentials", 401);
        }
        const isPasswordValid = await bcrypt.compare(
          dto.password,
          user.password
        );
        if (!isPasswordValid) {
          throw new HttpError("Invalid credentials", 401);
        }
      }

      if (!user.isVerified) {
        throw new HttpError("Email not verified", 403);
      }
      if (user.deletedAt) {
        throw new HttpError("User account is disabled", 401);
      }

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
