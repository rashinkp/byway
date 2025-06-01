import { ILessonContentOutputDTO } from "../../../../domain/dtos/lesson/lesson.dto";


export interface IGetContentByLessonIdUseCase {
  execute(lessonId: string, userId: string): Promise<ILessonContentOutputDTO | null>;
}
