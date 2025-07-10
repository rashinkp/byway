import { User } from "../../../../domain/entities/user.entity";
import { IAuthRepository } from "../../../repositories/auth.repository";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import * as bcrypt from "bcrypt";
import { IRegisterUseCase } from "../interfaces/register.usecase.interface";
import { OtpProvider } from "../../../../infra/providers/otp/otp.provider";
import { RegisterDto } from "../../../../domain/dtos/auth/register.dto";
import { AuthProvider } from "../../../../domain/enum/auth-provider.enum";

export class RegisterUseCase implements IRegisterUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private otpProvider: OtpProvider
  ) {}

  async execute(dto: RegisterDto): Promise<User> {
    let user = await this.authRepository.findUserByEmail(dto.email);

    try {
      if (user && user.isVerified) {
        throw new HttpError("Email already exists and is verified", 409);
      }

      if (!dto.password) {
        throw new HttpError("Password is required", 400);
      }
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      if (!user) {
        // Create new user
        user = User.create({
          name: dto.name,
          email: dto.email,
          password: hashedPassword,
          role: dto.role,
          authProvider: AuthProvider.EMAIL_PASSWORD,
        });
        user = await this.authRepository.createUser(user);
      } else {
        // Update existing unverified user
        user = User.update(user, {
          id: user.id,
          name: dto.name,
          password: hashedPassword,
        });
        user = await this.authRepository.updateUser(user);
      }

      await this.otpProvider.generateOtp(user.email, user.id);
      // TODO: Implement email sending
      // await this.emailProvider.sendOtpEmail(user.email, verification.otp);

      return user;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new HttpError(error.message, 400);
      }
      throw new HttpError("Registration failed", 500);
    }
  }
}
