import { ICreateEnrollmentInputDTO, IEnrollmentOutputDTO } from "../../domain/dtos/course/course.dto";


export interface IEnrollmentRepository {
  create(input: ICreateEnrollmentInputDTO): Promise<IEnrollmentOutputDTO[]>;
  findByUserAndCourse(
    userId: string,
    courseId: string
  ): Promise<IEnrollmentOutputDTO | null>;
}
