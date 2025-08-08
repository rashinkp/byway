import { ReduceMoneyDto, WalletResponseDto } from "../../../dtos/wallet";

export interface IReduceMoneyUseCase {
  execute(userId: string, data: ReduceMoneyDto): Promise<WalletResponseDto>;
}
