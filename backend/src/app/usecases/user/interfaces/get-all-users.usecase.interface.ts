import { GetAllUsersDto } from "../../../dtos/user.dto";
import { User } from "../../../../domain/entities/user.entity";
import { IPaginatedResponse } from "../../../repositories/user.repository";

export interface IGetAllUsersUseCase {
  execute(dto: GetAllUsersDto): Promise<IPaginatedResponse<User>>;
}
