import { ILessonContentOutputDTO } from "../../../dtos/lesson/lesson.dto";

export interface IGetContentByLessonIdUseCase {
  execute(
    lessonId: string,
    user: { id: string; role: string }
  ): Promise<ILessonContentOutputDTO | null>;
}
