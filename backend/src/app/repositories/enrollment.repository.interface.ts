
import { EnrollmentRecord } from "../records/enrollment.record";

export interface IEnrollmentRepository {
  create(enrollment: EnrollmentRecord): Promise<EnrollmentRecord>;
  findByUserAndCourse(userId: string, courseId: string): Promise<EnrollmentRecord | null>;
  findByUserId(userId: string): Promise<EnrollmentRecord[]>;
  findByCourseId(courseId: string): Promise<EnrollmentRecord[]>;
  update(enrollment: EnrollmentRecord): Promise<EnrollmentRecord>;
  delete(userId: string, courseId: string): Promise<void>;
  getEnrollmentStats(options: { userId?: string }): Promise<{
    totalEnrollments: number;
    activeEnrollments: number;
    completedCourses: number;
    inProgressCourses: number;
  }>;
}
