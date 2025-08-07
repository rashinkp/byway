
import { IWalletRepository } from "../../../repositories/wallet.repository.interface";
import { IGetWalletUseCase } from "../interfaces/get-wallet.usecase.interface";
import { Wallet } from "../../../../domain/entities/wallet.entity";
import { WalletResponseDto } from "@/app/dtos/wallet";

export class GetWalletUseCase implements IGetWalletUseCase {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async execute(userId: string): Promise<WalletResponseDto> {
    let wallet = await this.walletRepository.findByUserId(userId);

    if (!wallet) {
      wallet = Wallet.create(userId);
      wallet = await this.walletRepository.create(wallet);
    }

    return wallet.toResponse();
  }
}
