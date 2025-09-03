import { api } from "@/api/api";
import { ApiError } from "@/types/error";

export const releaseCheckoutLock = async (): Promise<{ released: boolean }> => {
  try {
    const response = await api.post("/stripe/release-checkout-lock");
    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    throw new Error(
      apiError.response?.data?.message || "Failed to release checkout lock"
    );
  }
};


