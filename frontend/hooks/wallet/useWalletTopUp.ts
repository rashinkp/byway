import { useMutation } from "@tanstack/react-query";
import { createWalletTopUp } from "@/api/wallet";
import { toast } from "sonner";
import { CreateWalletTopUpRequest } from "@/types/wallet.types";

export const useWalletTopUp = () => {
	return useMutation({
		mutationFn: (data: CreateWalletTopUpRequest) => createWalletTopUp(data),
		onSuccess: (response) => {
			if (response.data.session?.url) {
				window.location.href = response.data.session.url;
			} else {
				toast.success("Wallet topped up successfully");
			}
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
};
