import {
  UpdateProgressDto,
  IProgressOutputDTO,
} from "../../../dtos/progress.dto";
import { ApiResponse } from "../../../../presentation/http/interfaces/ApiResponse";

export interface IUpdateProgressUseCase {
  execute(input: UpdateProgressDto): Promise<ApiResponse<IProgressOutputDTO>>;
}
