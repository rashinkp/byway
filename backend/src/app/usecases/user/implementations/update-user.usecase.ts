import { ProfileDTO, UpdateUserDto, UserResponseDTO } from "../../../dtos/user.dto";
import { User } from "../../../../domain/entities/user.entity";
import { UserProfile } from "../../../../domain/entities/user-profile.entity";
import { Role } from "../../../../domain/enum/role.enum";
import { IUserRepository } from "../../../repositories/user.repository";
import { IUpdateUserUseCase } from "../interfaces/update-user.usecase.interface";
import { S3ServiceInterface } from "../../../providers/s3.service.interface";
import { ILogger } from "../../../providers/logger-provider.interface";
import { mapProfileToDTO, mapUserToDTO } from "../utils/user-dto-mapper";
import { UserNotFoundError } from "../../../../domain/errors/domain-errors";

export class UpdateUserUseCase implements IUpdateUserUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _s3Service: S3ServiceInterface,
    private _logger: ILogger
  ) {}

  async execute(
    dto: UpdateUserDto,
    userId: string
  ): Promise<{ user: UserResponseDTO; profile: ProfileDTO | null }> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }

    if (
      dto.avatar &&
      user.avatar &&
      dto.avatar !== user.avatar
    ) {
      try {
        await this._s3Service.deleteFile(user.avatar);
      } catch (err) {
        // Log this error since it's not critical to the main operation
        // and we want to track S3 cleanup issues
        this._logger.warn(`Failed to delete old avatar from S3: ${err}`);
      }
    }

    const updatedUser = User.update(user, {
      name: dto.name,
      avatar: dto.avatar,
      role: dto.role as Role,
    });

    let profile = await this._userRepository.findProfileByUserId(userId);

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
      profile = await this._userRepository.createProfile(profile);
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
      profile = await this._userRepository.updateProfile(profile);
    }

    const savedUser = await this._userRepository.updateUser(updatedUser);

    return { user: mapUserToDTO(savedUser)!, profile: mapProfileToDTO(profile) };
  }
}
