import {
  IInstructorDashboardResponse,
  IGetInstructorDashboardInput,
} from "../../../dtos/instructor-dashboard.dto";

export interface IGetInstructorDashboardUseCase {
  execute(
    input: IGetInstructorDashboardInput
  ): Promise<IInstructorDashboardResponse>;
}
