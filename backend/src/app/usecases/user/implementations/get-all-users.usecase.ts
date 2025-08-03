import { GetAllUsersDto } from "../../../dtos/user/user.dto";
import { User } from "../../../../domain/entities/user.entity";

import {
  IPaginatedResponse,
  IUserRepository,
} from "../../../repositories/user.repository";
import { IGetAllUsersUseCase } from "../interfaces/get-all-users.usecase.interface";

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: GetAllUsersDto): Promise<IPaginatedResponse<User>> {
    return await this.userRepository.findAll(dto);
  }
}
