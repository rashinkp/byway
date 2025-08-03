import {
  ILessonContentOutputDTO,
  IUpdateLessonContentInputDTO,
} from "../../../dtos/lesson/lesson.dto";

export interface IUpdateLessonContentUseCase {
  execute(dto: IUpdateLessonContentInputDTO): Promise<ILessonContentOutputDTO>;
}
