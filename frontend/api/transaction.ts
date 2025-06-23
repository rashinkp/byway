import { api } from "@/api/api";
import { ApiResponse } from "@/types/apiResponse";
import { Transaction } from "@/types/transaction";

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
  } catch (error: any) {
    console.error("Error creating transaction:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create transaction"
    );
  }
};

export const getTransactionById = async (
  transactionId: string
): Promise<ApiResponse<Transaction>> => {
  try {
    const response = await api.get(`/transactions/${transactionId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching transaction:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch transaction"
    );
  }
};

export const getTransactionsByOrder = async (
  orderId: string
): Promise<ApiResponse<Transaction[]>> => {
  try {
    const response = await api.get(`/transactions/order/${orderId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching transactions by order:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch transactions"
    );
  }
};

export const getTransactionsByUser = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/transactions/user`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching transactions by user:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch transactions");
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
  } catch (error: any) {
    console.error("Error updating transaction status:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update transaction status"
    );
  }
};
