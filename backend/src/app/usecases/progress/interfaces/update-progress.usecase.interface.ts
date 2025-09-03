import {
  UpdateProgressDto,
  IProgressOutputDTO,
} from "../../../dtos/progress.dto";


export interface IUpdateProgressUseCase {
  execute(input: UpdateProgressDto): Promise<IProgressOutputDTO>;
}
