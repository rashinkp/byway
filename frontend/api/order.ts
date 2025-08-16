import { api } from "@/api/api";
import { ApiResponse } from "@/types/general";
import { ApiError } from "@/types/error";
import { Order, OrdersResponse, GetOrdersParams, CreateOrderRequest, OrderResponse } from "@/types/order";

export const createOrder = async (
	data: CreateOrderRequest,
): Promise<ApiResponse<OrderResponse>> => {
	try {
		const response = await api.post("/orders", data);
		return response.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		console.error("Error creating order:", apiError);
		throw new Error(apiError.response?.data?.message || "Failed to create order");
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
	} catch (error: unknown) {
		const apiError = error as ApiError;
		console.error("Error updating order status:", apiError);
		throw new Error(
			apiError.response?.data?.message || "Failed to update order status",
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

export async function getOrders(
	params: GetOrdersParams,
): Promise<ApiResponse<OrdersResponse>> {
	const response = await api.get("/orders", { params });
	return response.data;
}

export async function retryOrder(
	orderId: string,
): Promise<{ data: { session: { url: string } } }> {
	const response = await api.post(`/orders/${orderId}/retry`);
	return response.data;
}
