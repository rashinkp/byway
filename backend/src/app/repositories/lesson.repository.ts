import { IGetAllLessonsInputDTO, IGetPublicLessonsInputDTO, ILessonListOutputDTO, IPublicLessonListOutputDTO } from "../../domain/dtos/lesson/lesson.dto";
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

  create(lesson: Lesson): Promise<Lesson>;
  update(lesson: Lesson): Promise<Lesson>;
  deletePermanently(id: string): Promise<void>;
}
