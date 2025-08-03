import { AddMoneyDto } from "../../../dtos/wallet/add-money.dto";
import { WalletResponseDto } from "../../../dtos/wallet/wallet-response.dto";

export interface IAddMoneyUseCase {
  execute(userId: string, data: AddMoneyDto): Promise<WalletResponseDto>;
}
