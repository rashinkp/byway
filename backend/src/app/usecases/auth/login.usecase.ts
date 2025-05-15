import { User } from "../../../domain/entities/user";
import { IAuthRepository } from "../../repositories/auth.repository";
import { HttpError } from "../../../presentation/http/utils/HttpErrors";
import * as bcrypt from "bcrypt";
import { LoginDto } from "../../../domain/dtos/auth/login.dto";

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(dto: LoginDto): Promise<User> {
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

    return user;
  }
}
