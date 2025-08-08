import {
  ICreateLessonInputDTO,
  ILessonOutputDTO,
} from "../../../dtos/lesson.dto";

export interface ICreateLessonUseCase {
  execute(dto: ICreateLessonInputDTO): Promise<ILessonOutputDTO>;
}
