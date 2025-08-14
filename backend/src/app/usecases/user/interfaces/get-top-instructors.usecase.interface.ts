import { InstructorStatsDTO } from "../../../dtos/stats.dto";


export interface IGetTopInstructorsInput {
  limit?: number;
}

export interface IGetTopInstructorsUseCase {
  execute(input: IGetTopInstructorsInput): Promise<InstructorStatsDTO[]>;
} 