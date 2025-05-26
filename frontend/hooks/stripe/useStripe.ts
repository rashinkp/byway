import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ICreateStripeCheckoutSessionInput,
  IStripeCheckoutSession,
  StripeApiResponse,
} from "@/types/stripe.types";
import { createStripeCheckoutSession, verifyPaymentStatus } from "@/api/stripe.api";

export function useStripe() {
  const createCheckoutSessionMutation = useMutation<
    StripeApiResponse<IStripeCheckoutSession>,
    Error,
    ICreateStripeCheckoutSessionInput
  >({
    mutationFn: async (data) => {
      const res = await createStripeCheckoutSession(data);
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
    },
    onMutate: async () => {
      toast.loading("Creating Stripe checkout session...");
    },
    onSuccess: async (data) => {
      console.log("Stripe checkout session success:", data);
      toast.success("Stripe checkout session created successfully!");
      
      if (data.data?.session?.url) {
        // Store session ID in localStorage for verification
        localStorage.setItem('stripe_session_id', data.data.session.id);
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

  const verifyPaymentMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      return verifyPaymentStatus(sessionId);
    },
    onSuccess: (data) => {
      if (data.status === "success") {
        toast.success("Payment verified successfully!");
        localStorage.removeItem('stripe_session_id');
      } else if (data.webhook?.status === "failed") {
        toast.error(data.webhook.failureReason || "Payment failed");
        localStorage.removeItem('stripe_session_id');
        // Redirect to failure page with error details
        window.location.href = `/payment-failed?error=${encodeURIComponent(data.webhook.failureReason || "Payment failed")}`;
      } else {
        toast.error("Payment verification failed");
      }
    },
    onError: (error) => {
      toast.error("Failed to verify payment", {
        description: error.message || "Please contact support if this persists.",
      });
      // Redirect to failure page on error
      window.location.href = `/payment-failed?error=${encodeURIComponent(error.message || "Payment verification failed")}`;
    },
  });

  return {
    createStripeCheckoutSession: createCheckoutSessionMutation.mutateAsync,
    verifyPayment: verifyPaymentMutation.mutateAsync,
    isCreatingSession: createCheckoutSessionMutation.isPending,
    isVerifyingPayment: verifyPaymentMutation.isPending,
  };
}
