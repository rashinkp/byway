import { ILessonContentOutputDTO } from "../../../../domain/dtos/lesson/lesson.dto";


export interface IGetContentByLessonIdUseCase {
  execute(lessonId: string): Promise<ILessonContentOutputDTO | null>;
}
