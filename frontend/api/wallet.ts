import { api } from "@/api/api";
import { ApiResponse } from "@/types/general";
import { ApiError } from "@/types/error";
import { CreateWalletTopUpRequest, IWallet, WalletApiResponse, WalletTopUpResponse } from "@/types/wallet.types";

export const getWallet = async (): Promise<WalletApiResponse<IWallet>> => {
	try {
		const response = await api.get("/wallet");
		return response.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(apiError.response?.data?.message || "Failed to fetch wallet");
	}
};

export const createWalletTopUp = async (
  data: CreateWalletTopUpRequest
): Promise<ApiResponse<WalletTopUpResponse>> => {
  try {
    const response = await api.post("/wallet/top-up", data);
    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    throw new Error(
      apiError.response?.data?.message || "Failed to create wallet top-up"
    );
  }
};
