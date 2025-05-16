import { User } from "../../../domain/entities/user";
import { IAuthRepository } from "../../repositories/auth.repository";
import { Role } from "../../../domain/enum/role.enum";
import { v4 as uuidv4 } from "uuid";
import { FacebookAuthDto } from "../../../domain/dtos/auth/facebook-auth.dto";

export class FacebookAuthUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(dto: FacebookAuthDto): Promise<User> {
    const { userId, name, email, picture } = dto;

    // Use email if provided, otherwise generate a placeholder
    const userEmail = email || `${userId}@facebook.com`;

    let user = await this.authRepository.findUserByEmail(userEmail);

    if (!user) {
      // Create new user
      user = new User(
        uuidv4(),
        name,
        userEmail,
        undefined, // No password
        undefined, // No googleId
        userId, // facebookId
        Role.LEARNER, // Default role
        true, // Verified by default
        new Date(),
        new Date(),
        picture // profileImage
      );
      await this.authRepository.createUser(user);
    } else {
      // Update existing user (verified or not)
      const updates: Partial<User> = {
        facebookId: userId,
        avatar: picture,
        updatedAt: new Date(),
      };

      // Optionally update name if different
      if (name && name !== user.name) {
        updates.name = name;
      }

      user = {
        ...user,
        ...updates,
        isVerified: true,
      };
      await this.authRepository.updateUser(user);
    }

    return user;
  }
}
