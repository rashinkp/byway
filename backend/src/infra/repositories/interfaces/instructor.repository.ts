import { Instructor } from "../../../domain/entities/instructor.entity";
import { APPROVALSTATUS } from "../../../domain/enum/approval-status.enum";



export interface IInstructorRepository {
  createInstructor(instructor: Instructor): Promise<Instructor>;
  updateInstructor(instructor: Instructor): Promise<Instructor>;
  findInstructorById(id: string): Promise<Instructor | null>;
  findInstructorByUserId(userId: string): Promise<Instructor | null>;
  findAllInstructors(page: number, limit: number, status?: APPROVALSTATUS): Promise<{ items: Instructor[]; total: number; totalPages: number }>;
}
