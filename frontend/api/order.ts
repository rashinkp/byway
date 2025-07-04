import { api } from "@/api/api";
import { ApiResponse } from "@/types/apiResponse";
import { Order, OrdersResponse, GetOrdersParams } from "@/types/order";

export interface CreateOrderRequest {
	courses: {
		id: string;
		title: string;
		description: string;
		thumbnail: string;
		price: number;
		offer: number;
		duration: string;
		lectures: number;
		level: string;
		creator: {
			name: string;
		};
	}[];
	paymentMethod: "WALLET" | "STRIPE" | "PAYPAL" | "RAZORPAY";
	couponCode?: string;
}

interface OrderResponse {
	order: Order;
	session?: {
		id: string;
		url: string;
		payment_status: string;
		amount_total: number;
	};
}

export const createOrder = async (
	data: CreateOrderRequest,
): Promise<ApiResponse<OrderResponse>> => {
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
			error.response?.data?.message || "Failed to update order status",
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
