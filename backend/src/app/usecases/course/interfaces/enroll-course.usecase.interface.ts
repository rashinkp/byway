import { ICreateEnrollmentInputDTO, IEnrollmentOutputDTO } from "../../../../domain/dtos/course/course.dto";


export interface IEnrollCourseUseCase {
  execute(input: ICreateEnrollmentInputDTO): Promise<IEnrollmentOutputDTO[]>;
}
