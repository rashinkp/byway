import { GetUserDto } from "../../../../domain/dtos/user/user.dto";
import { User } from "../../../../domain/entities/user.entity";
import { UserProfile } from "../../../../domain/entities/user-profile.entity";
import { Instructor } from "../../../../domain/entities/instructor.entity";

export interface IGetUserAdminDetailsUseCase {
  execute(
    dto: GetUserDto
  ): Promise<{ 
    user: User; 
    profile: UserProfile | null;
    instructor: Instructor | null;
  }>;
} 