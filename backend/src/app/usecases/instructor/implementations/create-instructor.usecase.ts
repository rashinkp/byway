import { CreateInstructorRequestDTO, InstructorResponseDTO } from "../../../dtos/instructor.dto";
import { Instructor } from "../../../../domain/entities/instructor.entity";
import { Role } from "../../../../domain/enum/role.enum";
import { IInstructorRepository } from "../../../repositories/instructor.repository";
import { IUserRepository } from "../../../repositories/user.repository";
import { ICreateInstructorUseCase } from "../interfaces/create-instructor.usecase.interface";
import { UserDTO } from "../../../dtos/general.dto";
import { UserAuthorizationError, BusinessRuleViolationError, UserNotFoundError } from "../../../../domain/errors/domain-errors";

export class CreateInstructorUseCase implements ICreateInstructorUseCase {
  constructor(
    private _instructorRepository: IInstructorRepository,
    private _userRepository: IUserRepository
  ) {}

  async execute(
    dto: CreateInstructorRequestDTO & { userId: string },
    requestingUser: UserDTO
  ): Promise<InstructorResponseDTO> {
    if (
      requestingUser.id !== dto.userId &&
      requestingUser.role !== Role.ADMIN
    ) {
      throw new UserAuthorizationError(
        "Unauthorized: Cannot create instructor for another user"
      );
    }

    const existingInstructor =
      await this._instructorRepository.findInstructorByUserId(dto.userId);
    if (existingInstructor?.status === "PENDING") {
      throw new BusinessRuleViolationError("Your application is under process please wait");
    }

    if (
      existingInstructor?.status === "DECLINED" &&
      existingInstructor.updatedAt
    ) {
      const now = new Date();
      const updatedAt = new Date(existingInstructor.updatedAt);
      const twentyFourHoursInMs = 24 * 60 * 60 * 1000;

      if (now.getTime() - updatedAt.getTime() < twentyFourHoursInMs) {
        throw new BusinessRuleViolationError(
          "Your application is declined. Please wait 24 hours before retrying."
        );
      }
    }

    const user = await this._userRepository.findById(dto.userId);
    if (!user) {
      throw new UserNotFoundError(dto.userId);
    }

    const instructor = Instructor.create(dto);
    const createdInstructor = await this._instructorRepository.createInstructor(
      instructor
    );

    // Note: User role will be updated to INSTRUCTOR only when the application is approved
    // This is handled in the ApproveInstructorUseCase

    return createdInstructor;
  }
}
