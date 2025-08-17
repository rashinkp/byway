import { IWalletRepository } from "../../../repositories/wallet.repository.interface";
import { IGetWalletUseCase } from "../interfaces/get-wallet.usecase.interface";
import { Wallet } from "../../../../domain/entities/wallet.entity";
import { WalletResponseDto } from "../../../dtos/wallet";

export class GetWalletUseCase implements IGetWalletUseCase {
  constructor(private readonly _walletRepository: IWalletRepository) {}

  async execute(userId: string): Promise<WalletResponseDto> {
    let wallet = await this._walletRepository.findByUserId(userId);

    if (!wallet) {
      wallet = Wallet.create(userId);
      wallet = await this._walletRepository.create(wallet);
    }

    return wallet.toResponse();
  }
}
