import {
  ICreateLessonContentInputDTO,
  ILessonContentOutputDTO,
} from "../../../dtos/lesson.dto";

export interface ICreateLessonContentUseCase {
  execute(
    dto: ICreateLessonContentInputDTO & { userId: string }
  ): Promise<ILessonContentOutputDTO>;
}
