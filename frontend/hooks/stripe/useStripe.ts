import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ICreateStripeCheckoutSessionInput,
  IStripeCheckoutSession,
  StripeApiResponse,
} from "@/types/stripe.types";
import { createStripeCheckoutSession } from "@/api/stripe.api";

export function useStripe() {
  const createCheckoutSessionMutation = useMutation<
    StripeApiResponse<IStripeCheckoutSession>,
    Error,
    ICreateStripeCheckoutSessionInput
  >({
    mutationFn: (data) =>
      createStripeCheckoutSession(data).then((res) => {
        console.log("Raw Stripe response:", JSON.stringify(res, null, 2));
        if (!res.data?.session) {
          throw new Error(res.message || "No session data received");
        }
        return {
          statusCode: res.statusCode,
          status: res.status,
          message: res.message,
          data: { session: res.data.session },
        };
      }),
    onMutate: async () => {
      toast.loading("Creating Stripe checkout session...");
    },
    onSuccess: (data) => {
      console.log("Stripe checkout session success:", data);
      toast.success("Stripe checkout session created successfully!");
      if (data.data?.session?.url) {
        console.log("Redirecting to Stripe checkout:", data.data.session.url);
        window.location.href = data.data.session.url;
      } else {
        console.error("No session URL in response:", data);
        toast.error("Failed to redirect to Stripe checkout");
      }
    },
    onError: (error) => {
      console.error("Stripe checkout session error:", error);
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
