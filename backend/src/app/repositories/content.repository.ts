import { LessonContent } from "../../domain/entities/content.entity";
import { IGenericRepository } from "./generic-repository.interface";

export interface ILessonContentRepository
  extends IGenericRepository<LessonContent> {
  findByLessonId(lessonId: string): Promise<LessonContent | null>;
}
