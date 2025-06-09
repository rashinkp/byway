import { api } from "@/api/api";
import { ApiResponse } from "@/types/apiResponse";

export interface CreateWalletTopUpRequest {
  amount: number;
  paymentMethod: "WALLET" | "STRIPE" | "PAYPAL" | "RAZORPAY";
}

interface WalletTopUpResponse {
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

export const createWalletTopUp = async (data: CreateWalletTopUpRequest): Promise<ApiResponse<WalletTopUpResponse>> => {
  try {
    const response = await api.post("/wallet/top-up", data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating wallet top-up:", error);
    throw new Error(error.response?.data?.message || "Failed to create wallet top-up");
  }
}; 