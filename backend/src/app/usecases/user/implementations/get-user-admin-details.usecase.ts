import { GetUserDto, ProfileDTO, UserResponseDTO } from "../../../dtos/user.dto";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { IUserRepository } from "../../../repositories/user.repository";
import { IInstructorRepository } from "../../../repositories/instructor.repository";
import { IGetUserAdminDetailsUseCase } from "../interfaces/get-user-admin-details.usecase.interface";
import { InstructorResponseDTO } from "../../../dtos/instructor.dto";

export class GetUserAdminDetailsUseCase implements IGetUserAdminDetailsUseCase {
  constructor(
    private userRepository: IUserRepository,
    private instructorRepository: IInstructorRepository
  ) {}

  async execute(dto: GetUserDto): Promise<{
    user: UserResponseDTO;
    profile: ProfileDTO | null;
    instructor: InstructorResponseDTO | null;
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

    return { user, profile, instructor };
  }
}
