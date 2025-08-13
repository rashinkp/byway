import { Transaction } from "../../domain/entities/transaction.entity";

export interface AddMoneyDto {
  amount: number;
  currency?: string;
}
export interface ReduceMoneyDto {
  amount: number;
  currency?: string;
} 

export interface TopUpWalletDto {
  amount: number; // must be positive (validation to be done elsewhere)
  paymentMethod: "WALLET" | "STRIPE" | "PAYPAL" | "RAZORPAY";
}


export interface WalletResponseDto {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
} 


export interface TopUpWalletResponseDTO {
  transaction: Transaction;
  session?: {
    id: string;
    url: string;
    payment_status: string;
    amount_total: number;
  };
}