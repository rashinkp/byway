import { CreateInstructorInput, IInstructorDetails } from "./instructor.types";

export interface IInstructorRepository {
  createInstructor(input: CreateInstructorInput): Promise<IInstructorDetails>;
}
