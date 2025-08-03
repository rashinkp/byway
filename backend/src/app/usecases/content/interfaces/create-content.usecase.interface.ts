import {
  ICreateLessonContentInputDTO,
  ILessonContentOutputDTO,
} from "../../../dtos/lesson/lesson.dto";

export interface ICreateLessonContentUseCase {
  execute(
    dto: ICreateLessonContentInputDTO & { userId: string }
  ): Promise<ILessonContentOutputDTO>;
}
