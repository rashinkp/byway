import {
  IInstructorDashboardResponse,
  IGetInstructorDashboardInput,
} from "@/app/dtos/instructor/instructor-dashboard.dto";

export interface IGetInstructorDashboardUseCase {
  execute(
    input: IGetInstructorDashboardInput
  ): Promise<IInstructorDashboardResponse>;
}
