import {
  ITopUpWalletUseCase,
  TopUpWalletResponse,
} from "../interfaces/top-up-wallet.usecase.interface";
import { TopUpWalletDto } from "../../../dtos/wallet/top-up.dto";
import { IWalletRepository } from "../../../repositories/wallet.repository.interface";
import { ITransactionRepository } from "../../../repositories/transaction.repository";
import { IPaymentService } from "../../../services/payment/interfaces/payment.service.interface";
import { TransactionType } from "../../../../domain/enum/transaction-type.enum";
import { TransactionStatus } from "../../../../domain/enum/transaction-status.enum";
import { PaymentGateway } from "../../../../domain/enum/payment-gateway.enum";
import { HttpError } from "../../../../presentation/http/errors/http-error";
import { StatusCodes } from "http-status-codes";
import { Transaction } from "../../../../domain/entities/transaction.entity";

export class TopUpWalletUseCase implements ITopUpWalletUseCase {
  constructor(
    private walletRepository: IWalletRepository,
    private transactionRepository: ITransactionRepository,
    private paymentService: IPaymentService
  ) {}

  async execute(
    userId: string,
    input: TopUpWalletDto
  ): Promise<TopUpWalletResponse> {
    const { amount, paymentMethod } = input;

    // Create a pending transaction without an orderId for wallet top-ups
    const transaction = await this.transactionRepository.create(
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
      const wallet = await this.walletRepository.findByUserId(userId);
      if (!wallet) {
        throw new HttpError("Wallet not found", StatusCodes.NOT_FOUND);
      }
      wallet.addAmount(amount);
      await this.walletRepository.update(wallet);
      await this.transactionRepository.updateStatus(
        transaction.id,
        TransactionStatus.COMPLETED
      );

      return {
        transaction,
      };
    } else {
      // For other payment methods, create a checkout session
      const session = await this.paymentService.createStripeCheckoutSession(
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
