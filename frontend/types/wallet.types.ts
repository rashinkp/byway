export interface IWallet {
	id: string;
	userId: string;
	balance: number;
	currency: string;
	createdAt: string;
	updatedAt: string;
}

export interface WalletApiResponse<T> {
	success: boolean;
	data: T;
	message: string;
	statusCode: number;
}



export interface CreateWalletTopUpRequest {
  amount: number;
  paymentMethod: "WALLET" | "STRIPE" | "PAYPAL" | "RAZORPAY";
}

export interface WalletTopUpResponse {
  transaction: {
    id: string;
    amount: number;
    status: string;
    type: string;
    createdAt: string;
  };
  session?: {
    id: string;
    url: string;
    payment_status: string;
    amount_total: number;
  };
}