import {
  IGetPublicLessonsInputDTO,
  IPublicLessonListOutputDTO,
} from "../../../dtos/lesson/lesson.dto";

export interface IGetPublicLessonsUseCase {
  execute(
    params: IGetPublicLessonsInputDTO
  ): Promise<IPublicLessonListOutputDTO>;
}
