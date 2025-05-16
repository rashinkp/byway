import { User } from "../../../domain/entities/user";
import { IAuthRepository } from "../../repositories/auth.repository";
import { HttpError } from "../../../presentation/http/utils/HttpErrors";
import * as bcrypt from "bcrypt";
import { RegisterDto } from "../../../domain/dtos/auth/register.dto";
import { v4 as uuidv4 } from "uuid";
import { OtpProvider } from "../../../infra/providers/otp/otp.provider";
import { Role } from "../../../domain/enum/role.enum";

export class RegisterUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private otpProvider: OtpProvider
  ) {}

  async execute(dto: RegisterDto): Promise<User> {
    const existingUser = await this.authRepository.findUserByEmail(dto.email);

    let user: User;

    if (existingUser) {
      if (existingUser.isVerified) {
        throw new HttpError("Email already exists and is verified", 409);
      }

      if (!dto.password) {
        throw new HttpError("Password is required", 400);
      }
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      user = {
        ...existingUser,
        name: dto.name,
        password: hashedPassword,
        role: dto.role as Role, 
        updatedAt: new Date(),
      };

      await this.authRepository.updateUser(user);
    } else {
      // Create new user
      if (!dto.password) {
        throw new HttpError("Password is required", 400);
      }
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      user = new User(
        uuidv4(),
        dto.name,
        dto.email,
        hashedPassword,
        undefined,
        undefined,
        dto.role as Role, 
        false,
        new Date(),
        new Date()
      );

      await this.authRepository.createUser(user);
    }

    // Generate and send OTP
    const verification = await this.otpProvider.generateOtp(
      user.email,
      user.id,
      "VERIFICATION"
    );
    // TODO: Uncomment when email provider is implemented
    // await this.emailProvider.sendOtpEmail(user.email, verification.otp);

    return user;
  }
}
