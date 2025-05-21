import { IGetAllLessonsInputDTO, ILessonListOutputDTO } from "../../../../domain/dtos/lesson/lesson.dto";

export interface IGetAllLessonsUseCase {
  execute(params: IGetAllLessonsInputDTO): Promise<ILessonListOutputDTO>;
}
