import {
  ICreateEnrollmentInputDTO,
  IEnrollmentOutputDTO,
} from "../../domain/dtos/course/course.dto";
import { Enrollment } from "../../domain/entities/enrollment.entity";
import { IEnrollmentStats, IGetEnrollmentStatsInput } from "../usecases/enrollment/interfaces/get-enrollment-stats.usecase.interface";

export interface IEnrollmentRepository {
  create(input: ICreateEnrollmentInputDTO): Promise<IEnrollmentOutputDTO[]>;
  findByUserAndCourse(
    userId: string,
    courseId: string
  ): Promise<IEnrollmentOutputDTO | null>;
  findByUserIdAndCourseIds(userId: string, courseIds: string[]): Promise<Enrollment[]>;
  findByUserId(userId: string): Promise<Enrollment[]>;
  findByCourseId(courseId: string): Promise<Enrollment[]>;
  delete(userId: string, courseId: string): Promise<void>;
  updateAccessStatus(userId: string, courseId: string, status: 'ACTIVE' | 'BLOCKED' | 'EXPIRED'): Promise<void>;

  // Enrollment stats method
  getEnrollmentStats(input: IGetEnrollmentStatsInput): Promise<IEnrollmentStats>;
}
