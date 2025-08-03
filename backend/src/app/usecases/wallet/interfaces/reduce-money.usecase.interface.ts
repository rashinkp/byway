import { ReduceMoneyDto } from "../../../dtos/wallet/reduce-money.dto";
import { WalletResponseDto } from "../../../dtos/wallet/wallet-response.dto";

export interface IReduceMoneyUseCase {
  execute(userId: string, data: ReduceMoneyDto): Promise<WalletResponseDto>;
}
