import { CreateInstructorRequestDTO } from "../../../../domain/dtos/instructor/instructor.dto";
import { Instructor } from "../../../../domain/entities/instructor.entity";
import { User } from "../../../../domain/entities/user";
import { Role } from "../../../../domain/enum/role.enum";
import { JwtPayload } from "../../../../presentation/express/middlewares/auth.middleware";
import { HttpError } from "../../../../presentation/http/utils/HttpErrors";
import { IInstructorRepository } from "../../../repositories/instructor.repository";
import { IUserRepository } from "../../../repositories/user.repository";
import { ICreateInstructorUseCase } from "../interfaces/create-instructor.usecase.interface";

export class CreateInstructorUseCase implements ICreateInstructorUseCase {
  constructor(
    private instructorRepository: IInstructorRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(dto: CreateInstructorRequestDTO & { userId: string }, requestingUser: JwtPayload): Promise<Instructor> {
    if (requestingUser.id !== dto.userId && requestingUser.role !== Role.ADMIN) {
      throw new HttpError("Unauthorized: Cannot create instructor for another user", 403);
    }

    const existingInstructor = await this.instructorRepository.findInstructorByUserId(dto.userId);
    if (existingInstructor) {
      throw new HttpError("User is already an instructor", 400);
    }

    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    const instructor = Instructor.create(dto);
    const createdInstructor = await this.instructorRepository.createInstructor(instructor);

    // Update user role to INSTRUCTOR
    const updatedUser = User.update(user, {
      id: user.id,
      role: Role.INSTRUCTOR,
    });
    await this.userRepository.updateUser(updatedUser);

    return createdInstructor;
  }
}
