import { UpdateUserDto } from "../../../dtos/user/user.dto";
import { User } from "../../../../domain/entities/user.entity";
import { UserProfile } from "../../../../domain/entities/user-profile.entity";
import { Role } from "../../../../domain/enum/role.enum";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { IUserRepository } from "../../../repositories/user.repository";
import { IUpdateUserUseCase } from "../interfaces/update-user.usecase.interface";
import { S3ServiceInterface } from "../../../providers/s3.service.interface";

export class UpdateUserUseCase implements IUpdateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private s3Service: S3ServiceInterface
  ) {}

  async execute(
    dto: UpdateUserDto,
    userId: string
  ): Promise<{ user: User; profile: UserProfile | null }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    if (
      dto.avatar &&
      user.avatar &&
      dto.avatar !== user.avatar &&
      user.avatar.includes(".s3.")
    ) {
      try {
        await this.s3Service.deleteFile(user.avatar);
        console.log("[Deleted] deleted old avatar");
      } catch (err) {
        console.error("Failed to delete old avatar from S3:", err);
      }
    }

    const updatedUser = User.update(user, {
      name: dto.name,
      avatar: dto.avatar,
      role: dto.role as Role,
    });

    let profile = await this.userRepository.findProfileByUserId(userId);

    if (!profile) {
      profile = UserProfile.create(userId, {
        // userId as first param, other fields in an options object
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
        // no id passed here, update only uses changes object
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
