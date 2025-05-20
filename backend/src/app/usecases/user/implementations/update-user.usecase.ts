import { UpdateUserDto } from "../../../../domain/dtos/user/user.dto";
import { User } from "../../../../domain/entities/user.entity";
import { UserProfile } from "../../../../domain/entities/user-profile.entity";
import { Role } from "../../../../domain/enum/role.enum";
import { HttpError } from "../../../../presentation/http/utils/HttpErrors";
import { IUserRepository } from "../../../../infra/repositories/interfaces/user.repository";
import { IUpdateUserUseCase } from "../interfaces/update-user.usecase.interface";

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
      role: dto.role as Role,
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
