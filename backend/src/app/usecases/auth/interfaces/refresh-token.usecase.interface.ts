import { AuthUserDTO } from "../../../dtos/auth.dto";

export interface IRefreshTokenUseCase {
  execute(refreshToken: string): Promise<AuthUserDTO>;
}


