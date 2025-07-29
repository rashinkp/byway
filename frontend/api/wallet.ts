import { api } from "@/api/api";
import { ApiResponse } from "@/types/general";
import { CreateWalletTopUpRequest, IWallet, WalletApiResponse, WalletTopUpResponse } from "@/types/wallet.types";

export const getWallet = async (): Promise<WalletApiResponse<IWallet>> => {
	try {
		const response = await api.get("/wallet");
		return response.data;
	} catch (error: any) {
		console.error("Error fetching wallet:", error);
		throw new Error(error.response?.data?.message || "Failed to fetch wallet");
	}
};

export const createWalletTopUp = async (
  data: CreateWalletTopUpRequest
): Promise<ApiResponse<WalletTopUpResponse>> => {
  try {
    const response = await api.post("/wallet/top-up", data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating wallet top-up:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create wallet top-up"
    );
  }
};
