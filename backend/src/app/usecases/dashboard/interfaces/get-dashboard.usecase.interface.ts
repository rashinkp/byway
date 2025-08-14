
import { IDashboardResponseDTO, IGetDashboardInputDTO } from "../../../dtos/dashboard.dto";

export interface IGetDashboardUseCase {
  execute(input: IGetDashboardInputDTO): Promise<IDashboardResponseDTO>;
}
