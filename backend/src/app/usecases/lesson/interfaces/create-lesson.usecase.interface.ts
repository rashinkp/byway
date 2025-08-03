import {
  ICreateLessonInputDTO,
  ILessonOutputDTO,
} from "../../../dtos/lesson/lesson.dto";

export interface ICreateLessonUseCase {
  execute(dto: ICreateLessonInputDTO): Promise<ILessonOutputDTO>;
}
