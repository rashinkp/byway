import { ICreateLessonInput, IGetAllLessonsInput, IGetAllLessonsResponse, IGetProgressInput, IGetPublicLessonsInput, IGetPublicLessonsResponse, ILesson, IUpdateLessonProgressInput, IUserLessonProgress } from "./lesson.types";

export interface ILessonRepository {
  createLesson(input: ICreateLessonInput): Promise<ILesson>;
  getLessonById(lessonId: string): Promise<ILesson | null>;
  getLessonsByCourseId(courseId: string): Promise<ILesson[]>;
  updateLessonProgress(
    input: IUpdateLessonProgressInput
  ): Promise<IUserLessonProgress>;
  getCourseProgress(input: IGetProgressInput): Promise<IUserLessonProgress[]>;
  getAllLessons(input: IGetAllLessonsInput): Promise<IGetAllLessonsResponse>;
  updateLesson(
    lessonId: string,
    input: Partial<ICreateLessonInput>
  ): Promise<ILesson>;
  deleteLesson(lessonId: string): Promise<void>;
  findLessonByWhere(where: any): Promise<ILesson | null>;
  getPreviousLessonProgress(
    userId: string,
    courseId: string,
    lessonOrder: number
  ): Promise<IUserLessonProgress | null>;
  getPublicLessons(
    input: IGetPublicLessonsInput
  ): Promise<IGetPublicLessonsResponse>;
}
