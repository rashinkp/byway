import { Lesson } from "../../domain/entities/lesson.entity";
import {
  ILessonFilterOptions,
  ILessonListResponse,
  IPublicLessonFilterOptions,
  IPublicLessonListResponse,
} from "../../domain/types/lesson.interface";
import { IGenericRepository } from "./base/generic-repository.interface";

export interface ILessonRepository extends IGenericRepository<Lesson> {
  getAllLessons(params: ILessonFilterOptions): Promise<ILessonListResponse>;
  getPublicLessons(
    params: IPublicLessonFilterOptions
  ): Promise<IPublicLessonListResponse>;
  findByCourseIdAndOrder(
    courseId: string,
    order: number
  ): Promise<Lesson | null>;
  findByCourseId(courseId: string): Promise<Lesson[]>;
  deletePermanently(id: string): Promise<void>;
  hasPublishedLessons(courseId: string): Promise<boolean>;
}
