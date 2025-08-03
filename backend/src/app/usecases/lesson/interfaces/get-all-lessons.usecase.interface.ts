import {
  IGetAllLessonsInputDTO,
  ILessonListOutputDTO,
} from "../../../dtos/lesson/lesson.dto";

export interface IGetAllLessonsUseCase {
  execute(params: IGetAllLessonsInputDTO): Promise<ILessonListOutputDTO>;
}
