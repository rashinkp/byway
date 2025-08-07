import {
  IInstructorDashboardResponse,
  IGetInstructorDashboardInput,
} from "../../..//dtos/instructor/instructor-dashboard.dto";

export interface IGetInstructorDashboardUseCase {
  execute(
    input: IGetInstructorDashboardInput
  ): Promise<IInstructorDashboardResponse>;
}
