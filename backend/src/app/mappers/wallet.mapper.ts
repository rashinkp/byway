import { Wallet } from "../../domain/entities/wallet.entity";
import { Transaction } from "../../domain/entities/transaction.entity";
import {
  GetWalletRequestDto,
  AddFundsRequestDto,
  WithdrawFundsRequestDto,
  GetWalletTransactionsRequestDto,
  WalletResponseDto,
  WalletTransactionResponseDto,
  WalletTransactionsListResponseDto,
  WalletSummaryResponseDto,
} from "../dtos/wallet.dto";

export class WalletMapper {
  // Domain Entity to Response DTOs
  static toWalletResponseDto(wallet: Wallet): WalletResponseDto {
    return {
      id: wallet.id,
      userId: wallet.userId,
      balance: wallet.getBalanceAmount(),
      currency: wallet.getBalanceCurrency(),
      isActive: !wallet.isEmpty(),
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt,
    };
  }

  static toWalletTransactionResponseDto(
    transaction: Transaction
  ): WalletTransactionResponseDto {
    return {
      id: transaction.id,
      userId: transaction.userId,
      walletId: transaction.walletId,
      amount: transaction.amount,
      currency: transaction.currency,
      type: transaction.type,
      status: transaction.status,
      description: transaction.description,
      transactionId: transaction.transactionId,
      paymentGateway: transaction.paymentGateway,
      orderId: transaction.orderId,
      courseId: transaction.courseId,
      metadata: transaction.metadata,
      isCompleted: transaction.isCompleted(),
      isPending: transaction.isPending(),
      isFailed: transaction.isFailed(),
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };
  }

  static toWalletTransactionsListResponseDto(
    transactions: WalletTransactionResponseDto[],
    pagination: {
      total: number;
      totalPages: number;
    }
  ): WalletTransactionsListResponseDto {
    return {
      transactions,
      total: pagination.total,
      totalPages: pagination.totalPages,
    };
  }

  static toWalletSummaryResponseDto(
    wallet: WalletResponseDto,
    summary: {
      totalDeposits: number;
      totalWithdrawals: number;
      totalTransactions: number;
      pendingTransactions: number;
      completedTransactions: number;
      failedTransactions: number;
    }
  ): WalletSummaryResponseDto {
    return {
      wallet,
      totalDeposits: summary.totalDeposits,
      totalWithdrawals: summary.totalWithdrawals,
      totalTransactions: summary.totalTransactions,
      pendingTransactions: summary.pendingTransactions,
      completedTransactions: summary.completedTransactions,
      failedTransactions: summary.failedTransactions,
    };
  }
}