import { ICreateLessonContentInputDTO, ILessonContentOutputDTO } from "../../../../domain/dtos/lesson/lesson.dto";


export interface ICreateLessonContentUseCase {
  execute(dto: ICreateLessonContentInputDTO & { userId: string }): Promise<ILessonContentOutputDTO>;
}
