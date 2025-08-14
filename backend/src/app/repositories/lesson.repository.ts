import { Lesson } from "../../domain/entities/lesson.entity";
import {
  ILessonFilterOptions,
  ILessonListResponse,
  IPublicLessonFilterOptions,
  IPublicLessonListResponse,
} from "../../domain/types/lesson.interface";

export interface ILessonRepository {
  getAllLessons(params: ILessonFilterOptions): Promise<ILessonListResponse>;
  getPublicLessons(
    params: IPublicLessonFilterOptions
  ): Promise<IPublicLessonListResponse>;
  findById(id: string): Promise<Lesson | null>;
  findByCourseIdAndOrder(
    courseId: string,
    order: number
  ): Promise<Lesson | null>;
  findByCourseId(courseId: string): Promise<Lesson[]>;
  create(lesson: Lesson): Promise<Lesson>;
  update(lesson: Lesson): Promise<Lesson>;
  deletePermanently(id: string): Promise<void>;
  hasPublishedLessons(courseId: string): Promise<boolean>;
}
