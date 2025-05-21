import { ILessonOutputDTO, IUpdateLessonInputDTO } from "../../../../domain/dtos/lesson/lesson.dto";

export interface IUpdateLessonUseCase {
  execute(dto: IUpdateLessonInputDTO): Promise<ILessonOutputDTO>;
}
