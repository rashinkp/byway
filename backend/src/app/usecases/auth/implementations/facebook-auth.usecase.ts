import { User } from "../../../../domain/entities/user.entity";
import { IAuthRepository } from "../../../repositories/auth.repository";
import { UserMapper } from "../../../mappers/user.mapper";
import { IFacebookAuthUseCase } from "../interfaces/facebook-auth.usecase.interface";
import { AuthProvider } from "../../../../domain/enum/auth-provider.enum";
import { Role } from "../../../../domain/enum/role.enum";
import { Email } from "../../../../domain/value-object/email";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { FacebookAuthRequestDto } from "@/app/dtos/auth.dto";

export class FacebookAuthUseCase implements IFacebookAuthUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(dto: FacebookAuthRequestDto): Promise<User> {
    try {
      const { userId, name, email, picture } = dto;

      const userEmail = email || `${userId}@facebook.com`;

      const existingUserRecord = await this.authRepository.findUserByEmail(userEmail);

      if (!existingUserRecord) {
        const emailObj = new Email(userEmail);
        const user = new User({
          id: "",
          name,
          email: emailObj,
          facebookId: userId,
          role: Role.USER,
          authProvider: AuthProvider.FACEBOOK,
          isVerified: true, 
          avatar: picture,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Save to repository and get back the record with ID
        const userRecord = await this.authRepository.createUser(user);
        return UserMapper.toDomain(userRecord);
      }

      // Update existing user
      const existingUser = UserMapper.toDomain(existingUserRecord);
      
      // Update user properties
      existingUser.updateProfile({ 
        name: name !== existingUser.name ? name : undefined,
        avatar: picture
      });
      
      existingUser.verifyEmail(); // Ensure user is verified
      
      // Save updated user
      const userRecord = await this.authRepository.updateUser(existingUser);
      return UserMapper.toDomain(userRecord);
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new HttpError(error.message, 400);
      }
      throw new HttpError("Failed to process Facebook authentication", 500);
    }
  }
}
