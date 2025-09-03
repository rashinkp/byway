import { useMutation } from "@tanstack/react-query";
import { releaseCheckoutLock } from "@/api/stripe";

export function useReleaseCheckoutLock() {
  return useMutation({
    mutationKey: ["release-checkout-lock"],
    mutationFn: () => releaseCheckoutLock(),
  });
}


