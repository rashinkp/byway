import { IGetPublicLessonsInputDTO, IPublicLessonListOutputDTO } from "../../../../domain/dtos/lesson/lesson.dto";


export interface IGetPublicLessonsUseCase {
  execute(params: IGetPublicLessonsInputDTO): Promise<IPublicLessonListOutputDTO>;
}