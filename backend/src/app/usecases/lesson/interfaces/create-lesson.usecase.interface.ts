import { ICreateLessonInputDTO, ILessonOutputDTO } from "../../../../domain/dtos/lesson/lesson.dto";

export interface ICreateLessonUseCase {
  execute(dto: ICreateLessonInputDTO): Promise<ILessonOutputDTO>;
}
