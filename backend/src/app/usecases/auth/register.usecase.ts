import { User } from "../../../domain/entities/user";
import { UserVerification } from "../../../domain/entities/verification";
import { IAuthRepository } from "../../repositories/auth.repository";
import { HttpError } from "../../../presentation/http/utils/HttpErrors";
import * as bcrypt from "bcrypt";
import { RegisterDto } from "../../../domain/dtos/auth/register.dto";
import { v4 as uuidv4 } from "uuid";
import { Role } from "../../../domain/enum/role.enum";

export class RegisterUseCase {
  constructor(private authRepository: IAuthRepository) {}

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
      dto.role as Role, // Assumes Role enum is updated
      false,
      new Date(),
      new Date()
    );

    const createdUser = await this.authRepository.createUser(user);

    // Create OTP verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const verification = new UserVerification(
      uuidv4(),
      createdUser.id,
      createdUser.email,
      otp,
      new Date(Date.now() + 10 * 60 * 1000), // Expires in 10 minutes
      0,
      false,
      new Date()
    );
    await this.authRepository.createVerification(verification);

    // TODO: Send OTP via email (implement in infra/providers/email)

    return createdUser;
  }
}
