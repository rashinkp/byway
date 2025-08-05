import { InstructorDetailsRecord } from "../records/instructor-details.record";

export interface IInstructorRepository {
  createInstructor(instructor: InstructorDetailsRecord): Promise<InstructorDetailsRecord>;
  updateInstructor(instructor: InstructorDetailsRecord): Promise<InstructorDetailsRecord>;
  findInstructorById(id: string): Promise<InstructorDetailsRecord | null>;
  findInstructorByUserId(userId: string): Promise<InstructorDetailsRecord | null>;
  findAllInstructors(options: {
    page: number;
    limit: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    filterBy?: "All" | "Pending" | "Approved" | "Declined";
    includeDeleted?: boolean;
  }): Promise<{ items: InstructorDetailsRecord[]; total: number; totalPages: number }>;
  getTopInstructors(options: { limit?: number }): Promise<{
    instructorId: string;
    name: string;
    totalCourses: number;
    totalStudents: number;
    totalRevenue: number;
    rating: number;
  }[]>;
}
