import { GetUserByIdRequestDto, UserWithProfileResponseDto } from "../../../dtos/user.dto";
import { Instructor } from "../../../../domain/entities/instructor.entity";

export interface IGetUserAdminDetailsUseCase {
  execute(dto: GetUserByIdRequestDto): Promise<{
    user: UserWithProfileResponseDto;
    instructor: Instructor | null;
  }>;
}
