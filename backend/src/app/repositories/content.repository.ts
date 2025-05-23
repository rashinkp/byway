import { LessonContent } from "../../domain/entities/lesson-content.entity";


export interface ILessonContentRepository {
  findById(id: string): Promise<LessonContent | null>;
  findByLessonId(lessonId: string): Promise<LessonContent | null>;
  create(content: LessonContent): Promise<LessonContent>;
  update(content: LessonContent): Promise<LessonContent>;
  delete(id: string): Promise<void>;
}
