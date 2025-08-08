import {
  IGetAllLessonsInputDTO,
  IGetPublicLessonsInputDTO,
  ILessonListOutputDTO,
  IPublicLessonListOutputDTO,
} from "../dtos/lesson.dto";
import { Lesson } from "../../domain/entities/lesson.entity";

export interface ILessonRepository {
  getAllLessons(params: IGetAllLessonsInputDTO): Promise<ILessonListOutputDTO>;
  getPublicLessons(
    params: IGetPublicLessonsInputDTO
  ): Promise<IPublicLessonListOutputDTO>;
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
