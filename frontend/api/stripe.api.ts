import { api } from "@/api/api";
import {
  ICreateStripeCheckoutSessionInput,
  IStripeCheckoutSession,
  StripeApiResponse,
} from "@/types/stripe.types";

export const createStripeCheckoutSession = async (
  data: ICreateStripeCheckoutSessionInput
): Promise<StripeApiResponse<IStripeCheckoutSession>> => {
  try {
    const response = await api.post("/strip/create-checkout-session", data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating Stripe checkout session:", error);
    throw new Error(
      error.response?.data?.message ||
        "Failed to create Stripe checkout session"
    );
  }
};
