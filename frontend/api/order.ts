import { api } from "@/api/api";
import { ApiResponse } from "@/types/apiResponse";
import { Order, OrdersResponse, GetOrdersParams } from "@/types/order";

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

export interface OrderItem {
  id: string;
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  discount: number | null;
  course: {
    id: string;
    title: string;
    thumbnail: string;
  };
}

export async function getOrders(params: GetOrdersParams = {}): Promise<OrdersResponse> {
  try {
    const response = await api.get<{ data: OrdersResponse }>("/orders", { params });
    return response.data.data;
  } catch (error: any) {
    console.error("Get orders error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw new Error(error.response?.data?.message || "Failed to fetch orders");
  }
}
