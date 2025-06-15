export interface ITopInstructor {
  instructorId: string;
  instructorName: string;
  email: string;
  courseCount: number;
  totalEnrollments: number;
  totalRevenue: number;
  averageRating: number;
  isActive: boolean;
}

export interface IGetTopInstructorsInput {
  limit?: number;
}

export interface IGetTopInstructorsUseCase {
  execute(input: IGetTopInstructorsInput): Promise<ITopInstructor[]>;
} 