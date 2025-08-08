import { DashboardInput, InstructorDashboardResponse } from "../../../dtos/stats.dto";


export interface IGetInstructorDashboardUseCase {
  execute(input: DashboardInput): Promise<InstructorDashboardResponse>;
}
