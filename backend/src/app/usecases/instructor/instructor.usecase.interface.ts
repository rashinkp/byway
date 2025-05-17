import { ApproveInstructorRequestDTO, CreateInstructorRequestDTO, DeclineInstructorRequestDTO, GetAllInstructorsRequestDTO, GetInstructorByUserIdRequestDTO, InstructorResponseDTO, UpdateInstructorRequestDTO } from "../../../domain/dtos/instructor/instructor.dto";
import { Instructor } from "../../../domain/entities/instructor.entity";
import { JwtPayload } from "../../../presentation/express/middlewares/auth.middleware";


export interface ICreateInstructorUseCase {
  execute(dto: CreateInstructorRequestDTO, requestingUser: JwtPayload): Promise<Instructor>;
}

export interface IUpdateInstructorUseCase {
  execute(dto: UpdateInstructorRequestDTO, requestingUser: JwtPayload): Promise<Instructor>;
}

export interface IApproveInstructorUseCase {
  execute(dto: ApproveInstructorRequestDTO, requestingUser: JwtPayload): Promise<Instructor>;
}

export interface IDeclineInstructorUseCase {
  execute(dto: DeclineInstructorRequestDTO, requestingUser: JwtPayload): Promise<Instructor>;
}

export interface IGetInstructorByUserIdUseCase {
  execute(dto: GetInstructorByUserIdRequestDTO): Promise<Instructor | null>;
}

export interface IGetAllInstructorsUseCase {
  execute(dto: GetAllInstructorsRequestDTO): Promise<{ items: InstructorResponseDTO[]; total: number; totalPages: number }>;
}
