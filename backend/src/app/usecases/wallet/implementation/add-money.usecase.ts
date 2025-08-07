
import { AddMoneyDto, WalletResponseDto } from "@/app/dtos/wallet";
import { Wallet } from "../../../../domain/entities/wallet.entity";
import { IWalletRepository } from "../../../repositories/wallet.repository.interface";
import { IAddMoneyUseCase } from "../interfaces/add-money.usecase.interface";

export class AddMoneyUseCase implements IAddMoneyUseCase {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async execute(userId: string, data: AddMoneyDto): Promise<WalletResponseDto> {
    let wallet = await this.walletRepository.findByUserId(userId);

    if (!wallet) {
      wallet = Wallet.create(userId);
      wallet = await this.walletRepository.create(wallet);
    }

    wallet.addAmount(data.amount, data.currency);
    const updatedWallet = await this.walletRepository.update(wallet);
    return updatedWallet.toResponse();
  }
}
