import { CourseController } from "../presentation/http/controllers/course.controller";
import { CreateCourseUseCase } from "../app/usecases/course/implementations/create-course.usecase";
import { GetAllCoursesUseCase } from "../app/usecases/course/implementations/get-all-courses.usecase";
import { UpdateCourseUseCase } from "../app/usecases/course/implementations/update-course.usecase";
import { DeleteCourseUseCase } from "../app/usecases/course/implementations/delete-course.usecase";
import { GetEnrolledCoursesUseCase } from "../app/usecases/course/implementations/get-enrolled-courses.usecases";
import { ApproveCourseUseCase } from "../app/usecases/course/implementations/approve-course.usecase";
import { DeclineCourseUseCase } from "../app/usecases/course/implementations/decline-course.usecase";
import { EnrollCourseUseCase } from "../app/usecases/course/implementations/enroll-course.usecase";
import { GetCourseWithDetailsUseCase } from "../app/usecases/course/implementations/get-course-with-details.usecase";
import { GetCourseStatsUseCase } from "../app/usecases/course/implementations/get-course-stats.usecase";
import { SharedDependencies } from './shared.dependencies';
import { CreateNotificationsForUsersUseCase } from '../app/usecases/notification/implementations/create-notifications-for-users.usecase';

export interface CourseDependencies {
  courseController: CourseController;
}

export function createCourseDependencies(
  deps: SharedDependencies,
  createNotificationsForUsersUseCase: CreateNotificationsForUsersUseCase
): CourseDependencies {
  const {
    courseRepository,
    categoryRepository,
    userRepository,
    enrollmentRepository,
    cartRepository,
    courseReviewRepository,
  } = deps;

  const createCourseUseCase =   new CreateCourseUseCase(
    courseRepository,
    categoryRepository,
    userRepository,
    createNotificationsForUsersUseCase
  );
  const getAllCoursesUseCase = new GetAllCoursesUseCase(
    courseRepository,
    enrollmentRepository,
    cartRepository,
    userRepository,
    courseReviewRepository,
    deps.lessonRepository
  );
  const getCourseWithDetailsUseCase = new GetCourseWithDetailsUseCase(
    courseRepository,
    enrollmentRepository,
    courseReviewRepository,
    cartRepository
  );
  const updateCourseUseCase = new UpdateCourseUseCase(
    courseRepository,
  );
  const deleteCourseUseCase = new DeleteCourseUseCase(
    courseRepository,
    createNotificationsForUsersUseCase
  );
  const getEnrolledCoursesUseCase = new GetEnrolledCoursesUseCase(
    courseRepository,
    userRepository,
    courseReviewRepository,
    deps.lessonRepository
  );
  const approveCourseUseCase = new ApproveCourseUseCase(courseRepository, userRepository, createNotificationsForUsersUseCase);
  const declineCourseUseCase = new DeclineCourseUseCase(courseRepository, userRepository, createNotificationsForUsersUseCase);
  const enrollCourseUseCase = new EnrollCourseUseCase(
    courseRepository,
    enrollmentRepository,
    userRepository
  );
  const getCourseStatsUseCase = new GetCourseStatsUseCase(courseRepository);

  const courseController = new CourseController(
    createCourseUseCase,
    getAllCoursesUseCase,
    getCourseWithDetailsUseCase,
    updateCourseUseCase,
    deleteCourseUseCase,
    getEnrolledCoursesUseCase,
    approveCourseUseCase,
    declineCourseUseCase,
    enrollCourseUseCase,
    getCourseStatsUseCase,
    deps.httpErrors,
    deps.httpSuccess,
  );

  return {
    courseController,
  };
}
