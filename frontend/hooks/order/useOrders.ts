import { useState, useCallback } from "react";
import { getOrders } from "@/api/order";
import { GetOrdersParams, OrdersResponse } from "@/types/order";

interface UseOrdersResult {
  orders: OrdersResponse | null;
  isLoading: boolean;
  error: string | null;
  fetchOrders: (params?: GetOrdersParams) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useOrders(): UseOrdersResult {
  const [orders, setOrders] = useState<OrdersResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentParams, setCurrentParams] = useState<GetOrdersParams>({});

  const fetchOrders = useCallback(async (params: GetOrdersParams = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getOrders(params);
      setOrders(response.data);
      setCurrentParams(params);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchOrders(currentParams);
  }, [fetchOrders, currentParams]);

  return {
    orders,
    isLoading,
    error,
    fetchOrders,
    refetch,
  };
} 