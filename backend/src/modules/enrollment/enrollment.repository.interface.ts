import { IEnrollment } from "./enrollment.types";

export interface IEnrollmentRepository {
  createEnrollment(userId: string, courseId: string): Promise<IEnrollment>;
  findEnrollment(userId: string, courseId: string): Promise<IEnrollment | null>;
  updateAccessStatus(
    userId: string,
    courseId: string,
    accessStatus: "ACTIVE" | "BLOCKED" | "EXPIRED"
  ): Promise<IEnrollment>;
}
