import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ICreateStripeCheckoutSessionInput,
  IStripeCheckoutSession,
  StripeApiResponse,
} from "@/types/stripe.types";
import { ApiResponse } from "@/types/apiResponse";
import { createStripeCheckoutSession } from "@/api/stripe.api";

export function useStripe() {
  const createCheckoutSessionMutation = useMutation<
    ApiResponse<IStripeCheckoutSession>,
    Error,
    ICreateStripeCheckoutSessionInput
  >({
    mutationFn: (data) =>
      createStripeCheckoutSession(data).then((res) => {
        console.log("Stripe checkout session response:", res); // Debug log
        if (!res.data?.session) {
          throw new Error("No session data received");
        }
        return {
          statusCode: res.statusCode,
          success: res.status === "success",
          message: res.message,
          data: res.data.session,
          error: res.status === "error" ? res.message : undefined,
        };
      }),
    onMutate: async () => {
      toast.loading("Creating Stripe checkout session...");
    },
    onSuccess: (data) => {
      console.log("Stripe checkout session success:", data); // Debug log
      toast.success("Stripe checkout session created successfully!");
      if (data.data?.url) {
        console.log("Redirecting to Stripe checkout:", data.data.url); // Debug log
        window.location.href = data.data.url;
      } else {
        console.error("No session URL in response:", data);
        toast.error("Failed to redirect to Stripe checkout");
      }
    },
    onError: (error) => {
      console.error("Stripe checkout session error:", error); // Debug log
      toast.error("Failed to create Stripe checkout session", {
        description: error.message || "An error occurred. Please try again.",
      });
    },
    onSettled: () => {
      toast.dismiss();
    },
  });

  return {
    createStripeCheckoutSession: createCheckoutSessionMutation.mutateAsync,
    isCreatingSession: createCheckoutSessionMutation.isPending,
  };
}
