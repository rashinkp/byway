// DTO for adding money to wallet
export interface AddMoneyDto {
  amount: number; // Positive number representing amount to add
  currency?: string; // Optional currency code, e.g., 'USD'; default can be applied in service layer
}

// DTO for reducing money from wallet
export interface ReduceMoneyDto {
  amount: number; // Positive number representing amount to reduce
  currency?: string; // Optional currency code, e.g., 'USD'; default handled in service layer
}

// DTO for topping up wallet with payment method
export interface TopUpWalletDto {
  amount: number; // Must be positive
  paymentMethod: "WALLET" | "STRIPE" | "PAYPAL" | "RAZORPAY";
}

// Response DTO representing wallet info sent back to the client
export interface WalletResponseDto {
  id: string; // Wallet ID
  userId: string; // Owner user ID
  balance: number; // Current balance amount
  currency: string; // Currency code, e.g., 'USD'
  createdAt: string; // ISO date string of creation time
  updatedAt: string; // ISO date string of last update time
}
