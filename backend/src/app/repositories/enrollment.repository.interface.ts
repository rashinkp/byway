import { Enrollment } from "../../domain/entities/enrollment.entity";
import { IEnrollmentWithDetails, ICreateEnrollmentInput, IEnrollmentStats, IGetEnrollmentStatsInput } from "../../domain/types/enrollment.interface";


export interface IEnrollmentRepository {
  create(input: ICreateEnrollmentInput): Promise<IEnrollmentWithDetails[]>;
  findByUserAndCourse(
    userId: string,
    courseId: string
  ): Promise<IEnrollmentWithDetails | null>;
  findByUserIdAndCourseIds(
    userId: string,
    courseIds: string[]
  ): Promise<Enrollment[]>;
  findByUserId(userId: string): Promise<Enrollment[]>;
  findByCourseId(courseId: string): Promise<Enrollment[]>;
  delete(userId: string, courseId: string): Promise<void>;
  updateAccessStatus(
    userId: string,
    courseId: string,
    status: "ACTIVE" | "BLOCKED" | "EXPIRED"
  ): Promise<void>;

  // Enrollment stats method
  getEnrollmentStats(
    input: IGetEnrollmentStatsInput
  ): Promise<IEnrollmentStats>;
}
