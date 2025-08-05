
import { EnrollmentRecord } from "../records/enrollment.record";

export interface IEnrollmentRepository {
  create(enrollment: EnrollmentRecord): Promise<EnrollmentRecord>;
  findByUserAndCourse(userId: string, courseId: string): Promise<EnrollmentRecord | null>;
  findByUserIdAndCourseIds(userId: string, courseIds: string[]): Promise<EnrollmentRecord[]>;
  findByUserId(userId: string): Promise<EnrollmentRecord[]>;
  findByCourseId(courseId: string): Promise<EnrollmentRecord[]>;
  delete(userId: string, courseId: string): Promise<void>;
  updateAccessStatus(userId: string, courseId: string, status: "ACTIVE" | "BLOCKED" | "EXPIRED"): Promise<void>;

  // Enrollment stats method
  getEnrollmentStats(options: { userId?: string }): Promise<{
    totalEnrollments: number;
    activeEnrollments: number;
    completedEnrollments: number;
    totalCourses: number;
  }>;
}
