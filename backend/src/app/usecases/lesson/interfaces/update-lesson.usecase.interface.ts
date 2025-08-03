import {
  ILessonOutputDTO,
  IUpdateLessonInputDTO,
} from "../../../dtos/lesson/lesson.dto";

export interface IUpdateLessonUseCase {
  execute(dto: IUpdateLessonInputDTO): Promise<ILessonOutputDTO>;
}
