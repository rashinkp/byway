import { WalletResponseDto } from "../../../dtos/wallet";

export interface IGetWalletUseCase {
  execute(userId: string): Promise<WalletResponseDto>;
}
