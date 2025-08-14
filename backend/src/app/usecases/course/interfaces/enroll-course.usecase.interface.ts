import { ICreateEnrollmentInput, IEnrollmentWithDetails } from "../../../../domain/types/enrollment.interface";

export interface IEnrollCourseUseCase {
  execute(input: ICreateEnrollmentInput): Promise<IEnrollmentWithDetails[]>;
}
