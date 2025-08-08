import {
  IGetAllLessonsInputDTO,
  ILessonListOutputDTO,
} from "../../../dtos/lesson.dto";

export interface IGetAllLessonsUseCase {
  execute(params: IGetAllLessonsInputDTO): Promise<ILessonListOutputDTO>;
}
