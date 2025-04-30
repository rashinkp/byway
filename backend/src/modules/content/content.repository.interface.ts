import { ICreateLessonContentInput, ILessonContent, IUpdateLessonContentInput } from "./content.types";

export interface IContentRepository {
  createContent(input: ICreateLessonContentInput): Promise<ILessonContent>;
  getContentByLessonId(lessonId: string): Promise<ILessonContent | null>;
  getContentById(id: string): Promise<ILessonContent | null>;
  updateContent(input: IUpdateLessonContentInput): Promise<ILessonContent>;
  deleteContent(id: string): Promise<void>;
}
