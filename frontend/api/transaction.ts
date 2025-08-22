import { api } from "@/api/api";
import { ApiResponse } from "@/types/general";
import { ApiError } from "@/types/error";
import { Transaction } from "@/types/transactions";

export const createTransaction = async (data: {
	orderId: string;
	userId: string;
	courseId?: string | null;
	amount: number;
	type: "PAYMENT" | "REFUND";
	status?: "PENDING" | "COMPLETED" | "FAILED";
	paymentGateway?: "STRIPE" | "PAYPAL" | "RAZORPAY" | null;
	transactionId?: string | null;
}): Promise<ApiResponse<Transaction>> => {
	try {
		const response = await api.post("/transactions", data);
		return response.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(
			apiError.response?.data?.message || "Failed to create transaction",
		);
	}
};

export const getTransactionById = async (
	transactionId: string,
): Promise<ApiResponse<Transaction>> => {
	try {
		const response = await api.get(`/transactions/${transactionId}`);
		return response.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(
			apiError.response?.data?.message || "Failed to fetch transaction",
		);
	}
};

export const getTransactionsByOrder = async (
	orderId: string,
): Promise<ApiResponse<Transaction[]>> => {
	try {
		const response = await api.get(`/transactions/order/${orderId}`);
		return response.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(
			apiError.response?.data?.message || "Failed to fetch transactions",
		);
	}
};

export const getTransactionsByUser = async (page = 1, limit = 10) => {
	try {
		const response = await api.get(`/transactions/user`, {
			params: { page, limit },
		});
		return response.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(
			apiError.response?.data?.message || "Failed to fetch transactions",
		);
	}
};

export const updateTransactionStatus = async (data: {
	transactionId: string;
	status: "PENDING" | "COMPLETED" | "FAILED";
	paymentGateway?: "STRIPE" | "PAYPAL" | "RAZORPAY" | null;
}): Promise<ApiResponse<Transaction>> => {
	try {
		const response = await api.patch("/transactions/status", data);
		return response.data;
	} catch (error: unknown) {
		const apiError = error as ApiError;
		throw new Error(
			apiError.response?.data?.message || "Failed to update transaction status",
		);
	}
};
