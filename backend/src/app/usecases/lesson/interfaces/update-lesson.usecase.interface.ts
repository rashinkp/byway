import {
  ILessonOutputDTO,
  IUpdateLessonInputDTO,
} from "../../../dtos/lesson.dto";

export interface IUpdateLessonUseCase {
  execute(dto: IUpdateLessonInputDTO): Promise<ILessonOutputDTO>;
}
