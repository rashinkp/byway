import { Instructor } from "../../domain/entities/instructor.entity";
import { APPROVALSTATUS } from "../../domain/enum/approval-status.enum";
import { IGetTopInstructorsInput, ITopInstructor } from "../usecases/user/interfaces/get-top-instructors.usecase.interface";

export interface IInstructorRepository {
  createInstructor(instructor: Instructor): Promise<Instructor>;
  updateInstructor(instructor: Instructor): Promise<Instructor>;
  findInstructorById(id: string): Promise<Instructor | null>;
  findInstructorByUserId(userId: string): Promise<Instructor | null>;
  findAllInstructors(
    page: number,
    limit: number,
    options: {
      search?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
      filterBy?: "All" | "Pending" | "Approved" | "Declined";
      includeDeleted?: boolean;
    }
  ): Promise<{ items: Instructor[]; total: number; totalPages: number }>;
  getTopInstructors(input: IGetTopInstructorsInput): Promise<ITopInstructor[]>;
}
