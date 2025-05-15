import { User } from "../../../domain/entities/user";
import { IAuthRepository } from "../../repositories/auth.repository";
import { HttpError } from "../../../presentation/http/utils/HttpErrors";
import * as bcrypt from "bcrypt";
import { RegisterDto } from "../../../domain/dtos/auth/register.dto";
import { v4 as uuidv4 } from "uuid";
import { OtpProvider } from "../../../infra/providers/otp/otp.provider";

export class RegisterUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private otpProvider: OtpProvider,
  ) {}

  async execute(dto: RegisterDto): Promise<User> {
    const existingUser = await this.authRepository.findUserByEmail(dto.email);
    if (existingUser) {
      throw new HttpError("Email already exists", 409);
    }

    let hashedPassword: string | undefined;
    if (dto.password) {
      hashedPassword = await bcrypt.hash(dto.password, 10);
    }

    const user = new User(
      uuidv4(),
      dto.name,
      dto.email,
      hashedPassword,
      undefined,
      undefined,
      dto.role as any, // TODO: Update Prisma schema Role enum
      false,
      new Date(),
      new Date()
    );

    const createdUser = await this.authRepository.createUser(user);

    
    const verification = await this.otpProvider.generateOtp(
      createdUser.email,
      createdUser.id,
      "VERIFICATION"
    );
    // await this.emailProvider.sendOtpEmail(createdUser.email, verification.otp);

    return createdUser;
  }
}
