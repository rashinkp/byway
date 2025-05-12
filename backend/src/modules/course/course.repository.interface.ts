import { ICourse, ICourseDetails, ICreateCourseInput, ICreateEnrollmentInput, IEnrollment, IGetAllCoursesInput, IGetEnrolledCoursesInput, IUpdateCourseInput } from "./course.types";

export interface ICourseRepository {
  createCourse(input: ICreateCourseInput): Promise<ICourse>;
  getAllCourses(
    input: IGetAllCoursesInput
  ): Promise<{ courses: ICourse[]; total: number; totalPage: number }>;
  getCourseById(courseId: string): Promise<ICourse | null>;
  getCourseByName(title: string): Promise<ICourse | null>;
  updateCourse(input: IUpdateCourseInput): Promise<ICourse>;
  softDeleteCourse(courseId: string, deletedAt: Date | null): Promise<ICourse>;
  createEnrollment(input: ICreateEnrollmentInput): Promise<IEnrollment>;
  getEnrollment(userId: string, courseId: string): Promise<IEnrollment | null>;
  getCourseDetails(courseId: string): Promise<ICourseDetails | null>;
  getEnrolledCourses(
    input: IGetEnrolledCoursesInput
  ): Promise<{ courses: ICourse[]; total: number; totalPage: number }>;
}
