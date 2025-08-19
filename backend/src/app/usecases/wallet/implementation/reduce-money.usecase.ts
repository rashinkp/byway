import { ReduceMoneyDto, WalletResponseDto } from "../../../dtos/wallet";
import { IWalletRepository } from "../../../repositories/wallet.repository.interface";
import { IReduceMoneyUseCase } from "../interfaces/reduce-money.usecase.interface";

export class ReduceMoneyUseCase implements IReduceMoneyUseCase {
  constructor(private readonly _walletRepository: IWalletRepository) {}

  async execute(
    userId: string,
    data: ReduceMoneyDto
  ): Promise<WalletResponseDto> {
    const wallet = await this._walletRepository.findByUserId(userId);

    if (!wallet) {
      throw new Error("Wallet not found");
    }

    wallet.reduceAmount(data.amount, data.currency);
    const updatedWallet = await this._walletRepository.update(wallet.id , wallet);
    return updatedWallet.toResponse();
  }
}
