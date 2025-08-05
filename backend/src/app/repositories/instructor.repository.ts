import { InstructorDetailsRecord } from "../records/instructor-details.record";

export interface IInstructorRepository {
  findAllInstructors(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    search?: string;
    status?: string;
  }): Promise<{ instructors: InstructorDetailsRecord[]; total: number; totalPages: number }>;
  getTopInstructors(options: { limit?: number }): Promise<{
    instructorId: string;
    name: string;
    totalStudents: number;
    totalCourses: number;
    averageRating: number;
  }[]>;
}
