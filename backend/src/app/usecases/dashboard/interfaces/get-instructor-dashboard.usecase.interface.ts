import { IInstructorDashboardResponse, IGetInstructorDashboardInput } from '@/domain/dtos/instructor/instructor-dashboard.dto';

export interface IGetInstructorDashboardUseCase {
  execute(input: IGetInstructorDashboardInput): Promise<IInstructorDashboardResponse>;
} 