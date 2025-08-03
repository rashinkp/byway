import { ILessonOutputDTO } from "../../../dtos/lesson/lesson.dto";

export interface IGetLessonByIdUseCase {
  execute(id: string): Promise<ILessonOutputDTO>;
}
