import { ILessonContentOutputDTO, IUpdateLessonContentInputDTO } from "../../../../domain/dtos/lesson/lesson.dto";


export interface IUpdateLessonContentUseCase {
  execute(dto: IUpdateLessonContentInputDTO): Promise<ILessonContentOutputDTO>;
}
