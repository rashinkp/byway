import { WalletResponseDto } from "../../../dtos/wallet/wallet-response.dto";

export interface IGetWalletUseCase {
  execute(userId: string): Promise<WalletResponseDto>;
}
