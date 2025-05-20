import { DeclineInstructorRequestDTO } from "../../../../domain/dtos/instructor/instructor.dto";
import { Instructor } from "../../../../domain/entities/instructor.entity";
import { Role } from "../../../../domain/enum/role.enum";
import { JwtPayload } from "../../../../presentation/express/middlewares/auth.middleware";
import { HttpError } from "../../../../presentation/http/utils/HttpErrors";
import { IInstructorRepository } from "../../../../infra/repositories/interfaces/instructor.repository";
import { IDeclineInstructorUseCase } from "../interfaces/decline-instructor.usecase.interface";

export class DeclineInstructorUseCase implements IDeclineInstructorUseCase {
  constructor(private instructorRepository: IInstructorRepository) {}

  async execute(
    dto: DeclineInstructorRequestDTO,
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

    instructor.decline();
    return this.instructorRepository.updateInstructor(instructor);
  }
}
