import { IRefreshTokenUseCase } from "../interfaces/refresh-token.usecase.interface";
import { IJwtProvider } from "../../../providers/jwt.provider.interface";
import { AuthUserDTO } from "../../../dtos/auth.dto";
import { UserAuthenticationError } from "../../../../domain/errors/domain-errors";
import { Role } from "../../../../domain/enum/role.enum";

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(private _jwtProvider: IJwtProvider) {}

  async execute(refreshToken: string): Promise<AuthUserDTO> {
    if (!refreshToken) {
      throw new UserAuthenticationError("No refresh token provided");
    }
    const payload = this._jwtProvider.verifyRefreshToken(refreshToken);
    if (
      !payload ||
      typeof payload !== "object" ||
      !("email" in payload && "id" in payload && "role" in payload)
    ) {
      throw new UserAuthenticationError("Invalid refresh token");
    }
    const { id, email, role } = payload as { id: string; email: string; role: Role };
    // name may not be in token; keep minimal
    return { id, name: "", email, role };
  }
}


