
import { TopUpWalletDto, TopUpWalletResponseDTO } from "../../../dtos/wallet";



export interface ITopUpWalletUseCase {
  execute(userId: string, input: TopUpWalletDto): Promise<TopUpWalletResponseDTO>;
}
