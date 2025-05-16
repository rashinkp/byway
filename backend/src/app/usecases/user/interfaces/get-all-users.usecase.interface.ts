import { GetAllUsersDto } from "../../../../domain/dtos/user/user.dto";
import { User } from "../../../../domain/entities/user";
import { IPaginatedResponse } from "../../../repositories/user.repository";

export interface IGetAllUsersUseCase {
  execute(dto: GetAllUsersDto): Promise<IPaginatedResponse<User>>;
}
