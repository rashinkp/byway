import { AddMoneyDto, WalletResponseDto } from "../../../dtos/wallet";
import { Wallet } from "../../../../domain/entities/wallet.entity";
import { IWalletRepository } from "../../../repositories/wallet.repository.interface";
import { IAddMoneyUseCase } from "../interfaces/add-money.usecase.interface";

export class AddMoneyUseCase implements IAddMoneyUseCase {
  constructor(private readonly _walletRepository: IWalletRepository) {}

  async execute(userId: string, data: AddMoneyDto): Promise<WalletResponseDto> {
    let wallet = await this._walletRepository.findByUserId(userId);

    if (!wallet) {
      wallet = Wallet.create(userId);
      wallet = await this._walletRepository.create(wallet);
    }

    wallet.addAmount(data.amount, data.currency);
    const updatedWallet = await this._walletRepository.update(wallet.id , wallet);
    return updatedWallet.toResponse();
  }
}
