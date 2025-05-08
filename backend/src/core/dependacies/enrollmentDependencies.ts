import { CourseService } from "../../modules/course/course.service";
import { EnrollmentController } from "../../modules/enrollment/enrollment.controller";
import { EnrollmentRepository } from "../../modules/enrollment/enrollment.repository";
import { EnrollmentService } from "../../modules/enrollment/enrollment.service";
import { UserService } from "../../modules/user/user.service";
import { IDatabaseProvider } from "../database";

export interface EnrollmentDependencies {
  enrollmentController: EnrollmentController;
}

export const initializeEnrollmentDependencies = (
  dbProvider: IDatabaseProvider,
  userService: UserService,
  courseService: CourseService
): EnrollmentDependencies => {
  const enrollmentRepository = new EnrollmentRepository(dbProvider.getClient());
  const enrollmentService = new EnrollmentService(
    enrollmentRepository,
    userService,
    courseService
  );
  const enrollmentController = new EnrollmentController(enrollmentService);

  return {
    enrollmentController,
  };
};
