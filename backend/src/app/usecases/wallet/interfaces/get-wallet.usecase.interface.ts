import { WalletResponseDto } from "../../../../domain/dtos/wallet/wallet-response.dto";


export interface IGetWalletUseCase {
  execute(userId: string): Promise<WalletResponseDto>;
} 