import {
  CreateInstructorInput,
  IInstructorDetails,
  UpdateInstructorStatusInput,
} from "./instructor.types";

export interface IInstructorRepository {
  createInstructor(input: CreateInstructorInput): Promise<IInstructorDetails>;
  updateInstructorStatus(
    input: UpdateInstructorStatusInput
  ): Promise<IInstructorDetails>;
  findInstructorById(instructorId: string): Promise<IInstructorDetails | null>;
  findAllInstructors(): Promise<IInstructorDetails[]>;
}
