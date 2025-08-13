import { IGetUserStatsInputDTO, IUserStatsDTO } from "../../../dtos/user.dto";


export interface IGetUserStatsUseCase {
  execute(input: IGetUserStatsInputDTO): Promise<IUserStatsDTO>;
} 
