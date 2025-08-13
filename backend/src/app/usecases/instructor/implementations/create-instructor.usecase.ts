import { CreateInstructorRequestDTO } from "../../../dtos/instructor.dto";
import { Instructor } from "../../../../domain/entities/instructor.entity";
import { Role } from "../../../../domain/enum/role.enum";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { IInstructorRepository } from "../../../repositories/instructor.repository";
import { IUserRepository } from "../../../repositories/user.repository";
import { ICreateInstructorUseCase } from "../interfaces/create-instructor.usecase.interface";
import { UserDTO } from "../../../dtos/general.dto";

export class CreateInstructorUseCase implements ICreateInstructorUseCase {
  constructor(
    private instructorRepository: IInstructorRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(
    dto: CreateInstructorRequestDTO & { userId: string },
    requestingUser: UserDTO
  ): Promise<Instructor> {
    if (
      requestingUser.id !== dto.userId &&
      requestingUser.role !== Role.ADMIN
    ) {
      throw new HttpError(
        "Unauthorized: Cannot create instructor for another user",
        403
      );
    }

    const existingInstructor =
      await this.instructorRepository.findInstructorByUserId(dto.userId);
    if (existingInstructor?.status === "PENDING") {
      throw new HttpError("Your application is under process please wait", 400);
    }

    if (
      existingInstructor?.status === "DECLINED" &&
      existingInstructor.updatedAt
    ) {
      const now = new Date();
      const updatedAt = new Date(existingInstructor.updatedAt);
      const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

      if (now.getTime() - updatedAt.getTime() < twentyFourHoursInMs) {
        throw new HttpError(
          "Your application is declined. Please wait 24 hours before retrying.",
          400
        );
      }
    }

    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new HttpError("User not found", 404);
    }

    const instructor = Instructor.create(dto);
    const createdInstructor = await this.instructorRepository.createInstructor(
      instructor
    );

    // Note: User role will be updated to INSTRUCTOR only when the application is approved
    // This is handled in the ApproveInstructorUseCase

    return createdInstructor;
  }
}
