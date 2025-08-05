import { GetUserByIdRequestDto, UserWithProfileResponseDto } from "../../../dtos/user.dto";
import { User } from "../../../../domain/entities/user.entity";
import { UserProfile } from "../../../../domain/entities/user-profile.entity";
import { Instructor } from "../../../../domain/entities/instructor.entity";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { IUserRepository } from "../../../repositories/user.repository";
import { IInstructorRepository } from "../../../repositories/instructor.repository";
import { IGetUserAdminDetailsUseCase } from "../interfaces/get-user-admin-details.usecase.interface";

export class GetUserAdminDetailsUseCase implements IGetUserAdminDetailsUseCase {
  constructor(
    private userRepository: IUserRepository,
    private instructorRepository: IInstructorRepository
  ) {}

  async execute(dto: GetUserByIdRequestDto): Promise<{
    user: UserWithProfileResponseDto;
    instructor: Instructor | null;
  }> {
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    const profile = await this.userRepository.findProfileByUserId(dto.userId);
    let instructor = null;

    instructor = await this.instructorRepository.findInstructorByUserId(
      dto.userId
    );

    // Transform to response DTO
    return { 
      user: {
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
      }, 
      instructor 
    };
  }
}
