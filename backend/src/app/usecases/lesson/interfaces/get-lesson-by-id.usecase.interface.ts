import { ILessonOutputDTO } from "../../../dtos/lesson.dto";

export interface IGetLessonByIdUseCase {
  execute(id: string): Promise<ILessonOutputDTO>;
}
