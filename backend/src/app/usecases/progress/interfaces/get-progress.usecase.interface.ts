import { GetProgressDto, IProgressOutputDTO } from "../../../dtos/progress.dto";


export interface IGetProgressUseCase {
  execute(input: GetProgressDto): Promise<IProgressOutputDTO>;
}
