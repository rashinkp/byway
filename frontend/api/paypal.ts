import { api } from "@/api/api";
import { ApiResponse } from "@/types/general";
import { ApiError } from "@/types/error";
import {
  IPaypalOrder,
  IPaypalWallet,
  ICreatePaypalOrderInput,
  ICapturePaypalOrderInput,
} from "@/types/paypal";

export const createPaypalOrder = async (
  data: ICreatePaypalOrderInput
): Promise<ApiResponse<IPaypalOrder>> => {
  try {
    const response = await api.post("/paypal/createorder", data);
    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    console.error("Error creating PayPal order:", apiError);
    throw new Error(
      apiError.response?.data?.message || "Failed to create PayPal order"
    );
  }
};

export const capturePaypalOrder = async (
  data: ICapturePaypalOrderInput
): Promise<ApiResponse<IPaypalWallet>> => {
  try {
    const response = await api.post("/paypal/captureorder", data);
    return response.data;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    console.error("Error capturing PayPal order:", apiError);
    throw new Error(
      apiError.response?.data?.message || "Failed to capture PayPal order"
    );
  }
};
