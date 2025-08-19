import {
  ITopUpWalletUseCase,
} from "../interfaces/top-up-wallet.usecase.interface";
import { IWalletRepository } from "../../../repositories/wallet.repository.interface";
import { ITransactionRepository } from "../../../repositories/transaction.repository";
import { IPaymentService } from "../../../services/payment/interfaces/payment.service.interface";
import { TransactionType } from "../../../../domain/enum/transaction-type.enum";
import { TransactionStatus } from "../../../../domain/enum/transaction-status.enum";
import { PaymentGateway } from "../../../../domain/enum/payment-gateway.enum";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { StatusCodes } from "http-status-codes";
import { Transaction } from "../../../../domain/entities/transaction.entity";
import { TopUpWalletDto, TopUpWalletResponseDTO } from "../../../dtos/wallet";

export class TopUpWalletUseCase implements ITopUpWalletUseCase {
  constructor(
    private _walletRepository: IWalletRepository,
    private _transactionRepository: ITransactionRepository,
    private _paymentService: IPaymentService
  ) {}

  async execute(
    userId: string,
    input: TopUpWalletDto
  ): Promise<TopUpWalletResponseDTO> {
    const { amount, paymentMethod } = input;

    // Create a pending transaction without an orderId for wallet top-ups
    const transaction = await this._transactionRepository.create(
      new Transaction({
        userId,
        amount,
        type: TransactionType.WALLET_TOPUP,
        status: TransactionStatus.PENDING,
        paymentGateway: paymentMethod as PaymentGateway,
        paymentMethod,
        metadata: {
          description: "Wallet top-up",
          isWalletTopUp: true,
        },
      })
    );

    // Handle different payment methods
    if (paymentMethod === "WALLET") {
      // For wallet payments, directly update the balance
      const wallet = await this._walletRepository.findByUserId(userId);
      if (!wallet) {
        throw new HttpError("Wallet not found", StatusCodes.NOT_FOUND);
      }
      wallet.addAmount(amount);
      await this._walletRepository.update(wallet.id , wallet);
      await this._transactionRepository.updateStatus(
        transaction.id,
        TransactionStatus.COMPLETED
      );

      return {
        transaction,
      };
    } else {
      // For other payment methods, create a checkout session
      const session = await this._paymentService.createStripeCheckoutSession(
        userId,
        transaction.id,
        {
          userId,
          courses: [
            {
              id: transaction.id,
              title: "Wallet Top-up",
              price: amount,
            },
          ],
          paymentMethod,
          couponCode: undefined,
          amount,
          isWalletTopUp: true,
          orderId: transaction.id,
        }
      );

      return {
        transaction,
        session: session.data.session,
      };
    }
  }
}
