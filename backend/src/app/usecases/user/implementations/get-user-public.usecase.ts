import { GetUserByIdRequestDto, UserWithProfileResponseDto } from "../../../dtos/user.dto";
import { User } from "../../../../domain/entities/user.entity";
import { UserProfile } from "../../../../domain/entities/user-profile.entity";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { IUserRepository } from "../../../repositories/user.repository";

export interface IGetPublicUserUseCase {
  execute(
    dto: GetUserByIdRequestDto
  ): Promise<UserWithProfileResponseDto>;
}

export class GetPublicUserUseCase implements IGetPublicUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    dto: GetUserByIdRequestDto
  ): Promise<UserWithProfileResponseDto> {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new HttpError("User not found", 404);
    }
    const profile = await this.userRepository.findProfileByUserId(dto.userId);
    
    // Transform to response DTO
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email.address,
        avatar: user.avatar,
        role: user.role,
        isActive: !user.isDeleted(),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      profile: profile ? {
        id: profile.id,
        userId: profile.userId,
        bio: profile.bio,
        education: profile.education,
        skills: profile.skills,
        phoneNumber: profile.phoneNumber,
        country: profile.country,
        city: profile.city,
        address: profile.address,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      } : null,
    };
  }
}
