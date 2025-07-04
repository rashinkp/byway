import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { IWallet, WalletApiResponse } from "@/types/wallet.types";
import { getWallet } from "@/api/wallet.api";

export function useWallet() {
	const {
		data: walletData,
		isLoading,
		error,
		refetch,
	} = useQuery<WalletApiResponse<IWallet>, Error>({
		queryKey: ["wallet"],
		queryFn: getWallet,
	});

	if (error) {
		toast.error("Failed to fetch wallet", {
			description: error.message || "Please try again later",
		});
	}

	return {
		wallet: walletData?.data,
		isLoading,
		error,
		refetch,
	};
}
