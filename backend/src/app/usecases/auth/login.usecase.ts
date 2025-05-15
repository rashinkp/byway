
import { User } from "../../../domain/entities/user";
import { IAuthRepository } from "../../repositories/auth.repository";
import { IJwtProvider } from "../../../infra/providers/auth/jwt.provider";
import { HttpError } from "../../../presentation/http/utils/HttpErrors";
import * as bcrypt from "bcrypt";
import { LoginDto } from "../../../domain/dtos/auth/login.dto";

export class LoginUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private jwtProvider: IJwtProvider
  ) {}

  async execute(dto: LoginDto): Promise<{ user: User; token: string }> {
    let user: User | null;

    if (dto.authProvider === "GOOGLE") {
      user = await this.authRepository.findUserByEmail(dto.email);
      if (!user || !user.googleId) {
        throw new HttpError("Invalid Google credentials", 401);
      }
    } else if (dto.authProvider === "FACEBOOK") {
      user = await this.authRepository.findUserByEmail(dto.email);
      if (!user || !user.facebookId) {
        throw new HttpError("Invalid Facebook credentials", 401);
      }
    } else {
      user = await this.authRepository.findUserByEmail(dto.email);
      if (!user || !dto.password || !user.password) {
        throw new HttpError("Invalid credentials", 401);
      }
      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) {
        throw new HttpError("Invalid credentials", 401);
      }
    }

    if (!user.isVerified) {
      throw new HttpError("Email not verified", 403);
    }

    const token = this.jwtProvider.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }
}
