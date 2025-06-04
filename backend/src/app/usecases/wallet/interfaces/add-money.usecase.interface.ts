import { AddMoneyDto } from "../../../../domain/dtos/wallet/add-money.dto";
import { WalletResponseDto } from "../../../../domain/dtos/wallet/wallet-response.dto";


export interface IAddMoneyUseCase {
  execute(userId: string, data: AddMoneyDto): Promise<WalletResponseDto>;
}