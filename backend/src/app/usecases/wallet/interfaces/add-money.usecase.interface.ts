import { AddMoneyDto, WalletResponseDto } from "../../../dtos/wallet";

export interface IAddMoneyUseCase {
  execute(userId: string, data: AddMoneyDto): Promise<WalletResponseDto>;
}
