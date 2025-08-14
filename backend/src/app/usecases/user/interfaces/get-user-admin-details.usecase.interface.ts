import { GetUserDto, ProfileDTO, UserResponseDTO } from "../../../dtos/user.dto";
import { InstructorResponseDTO } from "../../../dtos/instructor.dto";

export interface IGetUserAdminDetailsUseCase {
  execute(dto: GetUserDto): Promise<{
    user: UserResponseDTO;
    profile: ProfileDTO | null;
    instructor: InstructorResponseDTO | null;
  }>;
}
