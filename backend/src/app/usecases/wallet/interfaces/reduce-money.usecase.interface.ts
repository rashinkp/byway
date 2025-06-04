import { ReduceMoneyDto } from "../../../../domain/dtos/wallet/reduce-money.dto";
import { WalletResponseDto } from "../../../../domain/dtos/wallet/wallet-response.dto";


export interface IReduceMoneyUseCase {
  execute(userId: string, data: ReduceMoneyDto): Promise<WalletResponseDto>;
} 