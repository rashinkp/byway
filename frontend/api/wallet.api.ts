import { api } from "@/api/api";
import { IWallet, WalletApiResponse } from "@/types/wallet.types";

export const getWallet = async (): Promise<WalletApiResponse<IWallet>> => {
  try {
    const response = await api.get("/wallet");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching wallet:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch wallet"
    );
  }
}; 