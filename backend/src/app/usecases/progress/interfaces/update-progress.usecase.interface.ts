import {
  UpdateProgressDto,
  IProgressOutputDTO,
} from "../../../dtos/course/progress.dto";
import { ApiResponse } from "../../../../presentation/http/interfaces/ApiResponse";

export interface IUpdateProgressUseCase {
  execute(input: UpdateProgressDto): Promise<ApiResponse<IProgressOutputDTO>>;
}
