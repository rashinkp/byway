import { LessonContentRecord } from "../records/lesson-content.record";

export interface ILessonContentRepository {
  findById(id: string): Promise<LessonContentRecord | null>;
  findByLessonId(lessonId: string): Promise<LessonContentRecord | null>;
  create(content: LessonContentRecord): Promise<LessonContentRecord>;
  update(content: LessonContentRecord): Promise<LessonContentRecord>;
  delete(id: string): Promise<void>;
}
