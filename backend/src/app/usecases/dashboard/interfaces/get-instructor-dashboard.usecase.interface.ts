import {
  IInstructorDashboardResponse,
  IGetInstructorDashboardInput,
} from "../../../dtos/stats.dto";

export interface IGetInstructorDashboardUseCase {
  execute(
    input: IGetInstructorDashboardInput
  ): Promise<IInstructorDashboardResponse>;
}
