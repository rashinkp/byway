import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  IPaypalOrder,
  IPaypalWallet,
  ICreatePaypalOrderInput,
  ICapturePaypalOrderInput,
} from "@/types/paypal";
import { createPaypalOrder, capturePaypalOrder } from "@/api/paypal";

export function usePaypal() {
  // Updated return type to match what PaymentMethodSelection expects
  const createOrderMutation = useMutation<
    {
      status: string;
      order: { order: IPaypalOrder };
      message: string;
      statusCode: number;
    },
    Error,
    ICreatePaypalOrderInput
  >({
    mutationFn: (data) =>
      createPaypalOrder(data).then((res) => {
        const orderData: IPaypalOrder = {
          status: res.data.status,
          order: res.data.order || res.data,
        };
        return {
          status: "success",
          order: { order: orderData },
          message: "Order created successfully",
          statusCode: 200,
        };
      }),
    onMutate: async () => {
      toast.loading("Creating PayPal order...");
    },
    onSuccess: () => {
      toast.success("PayPal order created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create PayPal order", {
        description: error.message || "An error occurred. Please try again.",
      });
    },
    onSettled: () => {
      toast.dismiss();
    },
  });

  const captureOrderMutation = useMutation<
    IPaypalWallet,
    Error,
    ICapturePaypalOrderInput
  >({
    mutationFn: (data) => capturePaypalOrder(data).then((res) => res.data),
    onMutate: async () => {
      toast.loading("Capturing PayPal order...");
    },
    onSuccess: () => {
      toast.success("Payment completed successfully!");
      // TODO: Invalidate wallet-related queries if needed
      // queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
    onError: (error) => {
      toast.error("Failed to capture PayPal order", {
        description: error.message || "An error occurred. Please try again.",
      });
    },
    onSettled: () => {
      toast.dismiss();
    },
  });

  return {
    createPaypalOrder: createOrderMutation.mutateAsync,
    capturePaypalOrder: captureOrderMutation.mutateAsync,
    isCreatingOrder: createOrderMutation.isPending,
    isCapturingOrder: captureOrderMutation.isPending,
  };
}
