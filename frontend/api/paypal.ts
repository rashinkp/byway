import { api } from "@/api/api";
import { ApiResponse } from "@/types/general";
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
  } catch (error: any) {
    console.error("Error creating PayPal order:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create PayPal order"
    );
  }
};

export const capturePaypalOrder = async (
  data: ICapturePaypalOrderInput
): Promise<ApiResponse<IPaypalWallet>> => {
  try {
    const response = await api.post("/paypal/captureorder", data);
    return response.data;
  } catch (error: any) {
    console.error("Error capturing PayPal order:", error);
    throw new Error(
      error.response?.data?.message || "Failed to capture PayPal order"
    );
  }
};
