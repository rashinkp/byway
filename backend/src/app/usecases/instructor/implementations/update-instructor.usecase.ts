import { UpdateInstructorRequestDTO } from "../../../../domain/dtos/instructor/instructor.dto";
import { Instructor } from "../../../../domain/entities/instructor.entity";
import { Role } from "../../../../domain/enum/role.enum";
import { JwtPayload } from "../../../../presentation/express/middlewares/auth.middleware";
import { HttpError } from "../../../../presentation/http/utils/HttpErrors";
import { IInstructorRepository } from "../../../repositories/instructor.repository";
import { IUserRepository } from "../../../repositories/user.repository";
import { IUpdateInstructorUseCase } from "../interfaces/update-instructor.usecase.interface";

export class UpdateInstructorUseCase implements IUpdateInstructorUseCase {
  constructor(
    private instructorRepository: IInstructorRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(dto: UpdateInstructorRequestDTO, requestingUser: JwtPayload): Promise<Instructor> {
    const instructor = await this.instructorRepository.findInstructorById(dto.id);
    if (!instructor) {
      throw new HttpError("Instructor not found", 404);
    }

    if (instructor.userId !== requestingUser.id && requestingUser.role !== Role.ADMIN) {
      throw new HttpError("Unauthorized: Cannot update another instructor's details", 403);
    }

    const updatedInstructor = Instructor.update(instructor, dto);
    return this.instructorRepository.updateInstructor(updatedInstructor);
  }
}