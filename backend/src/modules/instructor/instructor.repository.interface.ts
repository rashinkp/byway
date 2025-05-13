import {
  CreateInstructorInput,
  IInstructorDetails,
  UpdateInstructorStatusInput,
  IInstructorWithUserDetails,
} from "./instructor.types";

export interface IInstructorRepository {
  createInstructor(input: CreateInstructorInput): Promise<IInstructorDetails>;
  updateInstructorStatus(
    input: UpdateInstructorStatusInput
  ): Promise<IInstructorDetails>;
  findInstructorById(instructorId: string): Promise<IInstructorDetails | null>;
  findInstructorByUserId(userId: string): Promise<IInstructorWithUserDetails>;
  findAllInstructors(): Promise<IInstructorWithUserDetails[]>; 
}
