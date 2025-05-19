import { ApproveInstructorRequestDTO, CreateInstructorRequestDTO, DeclineInstructorRequestDTO, GetAllInstructorsRequestDTO, GetInstructorByUserIdRequestDTO, InstructorResponseDTO, UpdateInstructorRequestDTO } from "../../../domain/dtos/instructor/instructor.dto";
import { Instructor } from "../../../domain/entities/instructor.entity";
import { User } from "../../../domain/entities/user";
import { APPROVALSTATUS } from "../../../domain/enum/approval-status.enum";
import { Role } from "../../../domain/enum/role.enum";
import { JwtPayload } from "../../../presentation/express/middlewares/auth.middleware";
import { HttpError } from "../../../presentation/http/utils/HttpErrors";
import { IInstructorRepository } from "../../repositories/instructor.repository";
import { IUserRepository } from "../../repositories/user.repository";
import { IApproveInstructorUseCase, ICreateInstructorUseCase, IDeclineInstructorUseCase, IGetAllInstructorsUseCase, IGetInstructorByUserIdUseCase, IUpdateInstructorUseCase } from "./instructor.usecase.interface";


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

export class ApproveInstructorUseCase implements IApproveInstructorUseCase {
  constructor(private instructorRepository: IInstructorRepository) {}

  async execute(dto: ApproveInstructorRequestDTO, requestingUser: JwtPayload): Promise<Instructor> {
    if (requestingUser.role !== Role.ADMIN) {
      throw new HttpError("Unauthorized: Admin access required", 403);
    }

    const instructor = await this.instructorRepository.findInstructorById(dto.instructorId);
    if (!instructor) {
      throw new HttpError("Instructor not found", 404);
    }

    instructor.approve();
    return this.instructorRepository.updateInstructor(instructor);
  }
}

export class DeclineInstructorUseCase implements IDeclineInstructorUseCase {
  constructor(private instructorRepository: IInstructorRepository) {}

  async execute(dto: DeclineInstructorRequestDTO, requestingUser: JwtPayload): Promise<Instructor> {
    if (requestingUser.role !== Role.ADMIN) {
      throw new HttpError("Unauthorized: Admin access required", 403);
    }

    const instructor = await this.instructorRepository.findInstructorById(dto.instructorId);
    if (!instructor) {
      throw new HttpError("Instructor not found", 404);
    }

    instructor.decline();
    return this.instructorRepository.updateInstructor(instructor);
  }
}

export class GetInstructorByUserIdUseCase implements IGetInstructorByUserIdUseCase {
  constructor(private instructorRepository: IInstructorRepository) {}

  async execute(dto: GetInstructorByUserIdRequestDTO): Promise<Instructor | null> {
    return this.instructorRepository.findInstructorByUserId(dto.userId);
  }
}

export class GetAllInstructorsUseCase implements IGetAllInstructorsUseCase {
  constructor(
    private instructorRepository: IInstructorRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(dto: GetAllInstructorsRequestDTO): Promise<{ items: InstructorResponseDTO[]; total: number; totalPages: number }> {
    const { items, total, totalPages } = await this.instructorRepository.findAllInstructors(dto.page || 1, dto.limit || 10, dto.status);

    const instructorResponses: InstructorResponseDTO[] = [];
    for (const instructor of items) {
      const user = await this.userRepository.findById(instructor.userId);
      if (user) {
        instructorResponses.push({
          id: instructor.id,
          userId: instructor.userId,
          areaOfExpertise: instructor.areaOfExpertise,
          professionalExperience: instructor.professionalExperience,
          about: instructor.about,
          website: instructor.website,
          status: instructor.status as APPROVALSTATUS,
          totalStudents: instructor.totalStudents,
          createdAt: instructor.createdAt,
          updatedAt: instructor.updatedAt,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          },
        });
      }
    }

    return { items: instructorResponses, total, totalPages };
  }
}
