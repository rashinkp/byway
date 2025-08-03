import {
  GetAllInstructorsRequestDTO,
  InstructorResponseDTO,
} from "../../../dtos/instructor/instructor.dto";
import { APPROVALSTATUS } from "../../../../domain/enum/approval-status.enum";
import { IInstructorRepository } from "../../../repositories/instructor.repository";
import { IUserRepository } from "../../../repositories/user.repository";
import { IGetAllInstructorsUseCase } from "../interfaces/get-all-instructors.usecase.interface";

export class GetAllInstructorsUseCase implements IGetAllInstructorsUseCase {
  constructor(
    private instructorRepository: IInstructorRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(dto: GetAllInstructorsRequestDTO): Promise<{
    items: InstructorResponseDTO[];
    total: number;
    totalPages: number;
  }> {
    const { items, total, totalPages } =
      await this.instructorRepository.findAllInstructors(
        dto.page || 1,
        dto.limit || 10,
        {
          search: dto.search,
          sortBy: dto.sortBy,
          sortOrder: dto.sortOrder,
          filterBy: dto.filterBy,
          includeDeleted: dto.includeDeleted,
        }
      );

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
          education: instructor.education,
          certifications: instructor.certifications,
          cv: instructor.cv,
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
            deletedAt: user.deletedAt,
          },
        });
      }
    }

    return { items: instructorResponses, total, totalPages };
  }
}
