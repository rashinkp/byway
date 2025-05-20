import {
  GetAllUsersDto,
  GetUserDto,
  ToggleDeleteUserDto,
  UpdateUserDto,
} from "../../../../domain/dtos/user/user.dto";
import { User } from "../../../../domain/entities/user.entity";
import { UserProfile } from "../../../../domain/entities/user-profile.entity";
import { HttpError } from "../../../../presentation/http/utils/HttpErrors";
import {
  IPaginatedResponse,
  IUserRepository,
} from "../../../../infra/repositories/interfaces/user.repository";
import { IGetAllUsersUseCase } from "../interfaces/get-all-users.usecase.interface";
import { IToggleDeleteUserUseCase } from "../interfaces/toggle-delete-user.usecase.interface";

export class GetAllUsersUseCase implements IGetAllUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: GetAllUsersDto): Promise<IPaginatedResponse<User>> {
    return await this.userRepository.findAll(dto);
  }
}
