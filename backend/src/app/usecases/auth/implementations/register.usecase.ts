import { User } from "../../../../domain/entities/user.entity";
import { IAuthRepository } from "../../../repositories/auth.repository";
import { IRegisterUseCase } from "../interfaces/register.usecase.interface";
import { AuthProvider } from "../../../../domain/enum/auth-provider.enum";
import { RegisterDto, AuthUserDTO } from "../../../dtos/auth.dto";
import { IOtpProvider } from "../../../providers/otp-provider.interface";
import { IPasswordHasher } from "../../../providers/password-hasher.interface";
import { mapUserToAuthUserDTO } from "../../user/utils/user-dto-mapper";
import { 
  UserValidationError, 
  BusinessRuleViolationError 
} from "../../../../domain/errors/domain-errors";
import { Role } from "../../../../domain/enum/role.enum";

export class RegisterUseCase implements IRegisterUseCase {
  constructor(
    private _authRepository: IAuthRepository,
    private _otpProvider: IOtpProvider,
    private _passwordHasher: IPasswordHasher
  ) {}

  async execute(dto: RegisterDto): Promise<AuthUserDTO> {
    let user = await this._authRepository.findUserByEmail(dto.email);

    try {
      if (user && user.isVerified) {
        throw new BusinessRuleViolationError("Email already exists and is verified");
      }

      if (!dto.password) {
        throw new UserValidationError("Password is required");
      }

      const hashedPassword = await this._passwordHasher.hash(dto.password);

      if (!user) {
        // Create new user
        user = User.create({
          name: dto.name,
          email: dto.email,
          password: hashedPassword,
          role: Role.USER,
          authProvider: AuthProvider.EMAIL_PASSWORD,
        });
        user = await this._authRepository.createUser(user);
      } else {
        // Update existing unverified user
        user = User.update(user, {
          name: dto.name,
          password: hashedPassword,
        });
        user = await this._authRepository.updateUser(user);
      }

      await this._otpProvider.generateOtp(user.email, user.id);

      return mapUserToAuthUserDTO(user);
    } catch (error) {
      if (error instanceof UserValidationError || 
          error instanceof BusinessRuleViolationError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new UserValidationError(error.message);
      }
      throw new UserValidationError("Registration failed");
    }
  }
}
