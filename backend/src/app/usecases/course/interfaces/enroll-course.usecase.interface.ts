import {
  ICreateEnrollmentInputDTO,
  IEnrollmentOutputDTO,
} from "../../../dtos/course.dto";

export interface IEnrollCourseUseCase {
  execute(input: ICreateEnrollmentInputDTO): Promise<IEnrollmentOutputDTO[]>;
}
