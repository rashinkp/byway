import { UpdateUserDto } from "../../../../domain/dtos/user/user.dto";
import { User } from "../../../../domain/entities/user";
import { UserProfile } from "../../../../domain/entities/user-profile";
import { HttpError } from "../../../../presentation/http/utils/HttpErrors";
import { IUserRepository } from "../../../repositories/user.repository";

export interface IUpdateUserUseCase {
  execute(
    dto: UpdateUserDto,
    userId: string
  ): Promise<{ user: User; profile: UserProfile | null }>;
}

export class UpdateUserUseCase implements IUpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    dto: UpdateUserDto,
    userId: string
  ): Promise<{ user: User; profile: UserProfile | null }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    const updatedUser = User.update(user, {
      id: user.id,
      name: dto.name,
      avatar: dto.avatar,
    });

    let profile = await this.userRepository.findProfileByUserId(userId);
    if (!profile) {
      profile = UserProfile.create({
        userId,
        bio: dto.bio,
        education: dto.education,
        skills: dto.skills,
        phoneNumber: dto.phoneNumber,
        country: dto.country,
        city: dto.city,
        address: dto.address,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        gender: dto.gender,
      });
      profile = await this.userRepository.createProfile(profile);
    } else {
      profile = UserProfile.update(profile, {
        id: profile.id,
        bio: dto.bio,
        education: dto.education,
        skills: dto.skills,
        phoneNumber: dto.phoneNumber,
        country: dto.country,
        city: dto.city,
        address: dto.address,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        gender: dto.gender,
      });
      profile = await this.userRepository.updateProfile(profile);
    }

    const savedUser = await this.userRepository.updateUser(updatedUser);
    return { user: savedUser, profile };
  }
}
