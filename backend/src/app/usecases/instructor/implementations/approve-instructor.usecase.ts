import { ApproveInstructorRequestDTO } from "../../../../domain/dtos/instructor/instructor.dto";
import { Instructor } from "../../../../domain/entities/instructor.entity";
import { Role } from "../../../../domain/enum/role.enum";
import { JwtPayload } from "../../../../presentation/express/middlewares/auth.middleware";
import { HttpError } from "../../../../presentation/http/utils/HttpErrors";
import { IUserRepository } from "../../../../infra/repositories/interfaces/user.repository";
import { IUpdateUserUseCase } from "../../user/interfaces/update-user.usecase.interface";
import { IApproveInstructorUseCase } from "../interfaces/approve-instructor.usecase.interface";
import { IInstructorRepository } from "../../../../infra/repositories/interfaces/instructor.repository";

export class ApproveInstructorUseCase implements IApproveInstructorUseCase {
  constructor(
    private instructorRepository: IInstructorRepository,
    private userRepository: IUserRepository,
    private updateUserUseCase: IUpdateUserUseCase
  ) {}

  async execute(
    dto: ApproveInstructorRequestDTO,
    requestingUser: JwtPayload
  ): Promise<Instructor> {
    if (requestingUser.role !== Role.ADMIN) {
      throw new HttpError("Unauthorized: Admin access required", 403);
    }

    const instructor = await this.instructorRepository.findInstructorById(
      dto.instructorId
    );
    if (!instructor) {
      throw new HttpError("Instructor not found", 404);
    }

    instructor.approve();

    // Update the user's role to INSTRUCTOR
    const user = await this.userRepository.findById(instructor.userId);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    await this.updateUserUseCase.execute(
      {
        role: Role.INSTRUCTOR,
      },
      user.id
    );

    return this.instructorRepository.updateInstructor(instructor);
  }
}
