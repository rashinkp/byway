import {
  ILessonContentOutputDTO,
  IUpdateLessonContentInputDTO,
} from "../../../dtos/lesson.dto";

export interface IUpdateLessonContentUseCase {
  execute(dto: IUpdateLessonContentInputDTO): Promise<ILessonContentOutputDTO>;
}
