import { ReduceMoneyDto } from "../../../dtos/wallet/reduce-money.dto";
import { WalletResponseDto } from "../../../dtos/wallet/wallet-response.dto";
import { IWalletRepository } from "../../../repositories/wallet.repository.interface";
import { IReduceMoneyUseCase } from "../interfaces/reduce-money.usecase.interface";

export class ReduceMoneyUseCase implements IReduceMoneyUseCase {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async execute(
    userId: string,
    data: ReduceMoneyDto
  ): Promise<WalletResponseDto> {
    const wallet = await this.walletRepository.findByUserId(userId);

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    wallet.reduceAmount(data.amount, data.currency);
    const updatedWallet = await this.walletRepository.update(wallet);
    return updatedWallet.toResponse();
  }
}
