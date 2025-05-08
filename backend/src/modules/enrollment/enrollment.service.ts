import { AppError } from "../../utils/appError";
import { logger } from "../../utils/logger";
import { UserService } from "../user/user.service";
import { CourseService } from "../course/course.service";
import { IEnrollmentRepository } from "./enrollment.repository.interface";
import { IEnrollment } from "./enrollment.types";

export class EnrollmentService {
  constructor(
    private enrollmentRepository: IEnrollmentRepository,
    private userService: UserService,
    private courseService: CourseService
  ) {}

  async createEnrollment(
    userId: string,
    courseId: string
  ): Promise<IEnrollment> {
    try {
      const user = await this.userService.findUserById(userId);
      if (!user || user.deletedAt) {
        throw AppError.notFound("User not found or deactivated");
      }

      const course = await this.courseService.getCourseById(courseId);
      if (!course || course.deletedAt) {
        throw AppError.notFound("Course not found");
      }

      if (course.deletedAt) {
        throw AppError.forbidden("Course is currently blocked");
      }

      const existingEnrollment = await this.enrollmentRepository.findEnrollment(
        userId,
        courseId
      );
      if (existingEnrollment) {
        throw AppError.badRequest("User is already enrolled in this course");
      }

      // Note: Payment validation will be added later when Payment module is implemented
      const enrollment = await this.enrollmentRepository.createEnrollment(
        userId,
        courseId
      );
      return enrollment;
    } catch (error) {
      logger.error("Create enrollment error:", { error, userId, courseId });
      throw error;
    }
  }

  async getEnrollment(
    userId: string,
    courseId: string
  ): Promise<IEnrollment | null> {
    try {
      const enrollment = await this.enrollmentRepository.findEnrollment(
        userId,
        courseId
      );
      return enrollment;
    } catch (error) {
      logger.error("Get enrollment error:", { error, userId, courseId });
      throw error;
    }
  }

  async updateAccessStatus(
    userId: string,
    courseId: string,
    accessStatus: "ACTIVE" | "BLOCKED" | "EXPIRED"
  ): Promise<IEnrollment> {
    try {
      const enrollment = await this.enrollmentRepository.findEnrollment(
        userId,
        courseId
      );
      if (!enrollment) {
        throw AppError.notFound("Enrollment not found");
      }

      const updatedEnrollment =
        await this.enrollmentRepository.updateAccessStatus(
          userId,
          courseId,
          accessStatus
        );
      return updatedEnrollment;
    } catch (error) {
      logger.error("Update access status error:", {
        error,
        userId,
        courseId,
        accessStatus,
      });
      throw error;
    }
  }
}
