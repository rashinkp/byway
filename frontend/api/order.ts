import { api } from "@/api/api";
import { ApiResponse } from "@/types/apiResponse";
import { Order } from "@/types/order";

export const createOrder = async (data: {
  courseIds: string[];
  couponCode?: string;
}): Promise<ApiResponse<Order>> => {
  try {
    const response = await api.post("/orders", data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating order:", error);
    throw new Error(error.response?.data?.message || "Failed to create order");
  }
};

export const updateOrderStatus = async (data: {
  orderId: string;
  paymentStatus: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  paymentId?: string;
  paymentGateway?: "STRIPE" | "PAYPAL" | "RAZORPAY" | null;
}): Promise<ApiResponse<Order>> => {
  try {
    const response = await api.post("/orders/status", data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating order status:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update order status"
    );
  }
};
