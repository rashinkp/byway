import { GetProgressDto, IProgressOutputDTO } from "../../../dtos/progress.dto";
import { ApiResponse } from "../../../../presentation/http/interfaces/ApiResponse";

export interface IGetProgressUseCase {
  execute(input: GetProgressDto): Promise<ApiResponse<IProgressOutputDTO>>;
}
